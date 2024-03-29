import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { onDragMove } from '../../common/onDragMove.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { style } from './splitter.style.js'
import { template } from './splitter.template.js'
import { template as handleTemplate } from './handle.template.js'
import { BlSplitterPane } from './pane.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-splitter',
  styles: [style],
})
export class BlSplitter extends BlComponent {
  @attr('enum', { enumValues: ['horizontal', 'vertical'] })
  accessor direction: OneOf<['horizontal', 'vertical']> = 'horizontal'

  @attr('int') accessor handleSize = 6

  panes: BlSplitterPane[] = []
  handles: HTMLElement[] = []

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('[part="panes"]') accessor $panes!: HTMLElement
  @shadowRef('[part="cover"]') accessor $cover!: HTMLElement
  @shadowRef('[part="default-slot"]') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupSlotEvent()
    this.#setupResizeEvents()
    this.#setupSizeObserve()

    this.hook.onConnected(this.render)
    this.hook.onAttributeChangedDep('direction', this._renderDirection)
    this.hook.onAttributeChangedDep('handle-size', this.layout)
  }

  _renderDirection() {
    this.panes.forEach($pane => {
      $pane.classList.toggle('horizontal', this.direction === 'horizontal')
      $pane.classList.toggle('vertical', this.direction === 'vertical')
    })
  }

  get size() {
    return this.$panes[this.direction === 'horizontal' ? 'clientWidth' : 'clientHeight']
  }

  #setupSizeObserve() {
    let clear: (() => void) | undefined
    this.hook.onConnected(() => {
      clear = sizeObserve(this, this.layout.bind(this))
    })
    this.hook.onDisconnected(() => {
      if (clear) {
        clear()
        clear = undefined
      }
    })
  }

  renderHandles() {
    const { $layout, $cover } = this
    const count = this.panes.length - 1
    let len = $layout.querySelectorAll('.handle').length
    while (len++ < count) {
      $layout.insertBefore(handleTemplate(), $cover)
    }
    len = $layout.querySelectorAll('.handle').length
    while (len-- > count) {
      $layout.removeChild($layout.querySelector('.handle')!)
    }
    this.handles = Array.prototype.slice.call($layout.querySelectorAll('.handle'))
    this.handles.forEach(($handle, index) => {
      const offset = this.getPanePosition(this.panes[index + 1]) - this.handleSize / 2
      const sizeProp = this.direction === 'horizontal' ? 'width' : 'height'
      const posProp = this.direction === 'horizontal' ? 'left' : 'top'
      $handle.style.cssText = `${sizeProp}:${this.handleSize}px;${posProp}:${offset}px;`
    })
  }

  /** 计算 pane 的尺寸 */
  getPaneSize($pane: BlSplitterPane) {
    let size = $pane.size || 0
    size = Math.max(size, $pane.min)
    size = Math.min(size, $pane.max)
    return size
  }

  /** 检测面板是否冻结尺寸不允许调整 */
  isSizeFrozen($pane: BlSplitterPane) {
    return $pane.max === $pane.min
  }

  /** 计算 pane 的定位 */
  getPanePosition($pane: BlSplitterPane) {
    if (this.panes.length) {
      const index = this.panes.indexOf($pane)
      if (index !== -1) {
        return this.panes.slice(0, index).reduce((acc, pane) => {
          return acc + this.getPaneSize(pane)
        }, 0)
      }
    }
    return 0
  }

  /** 获取拖拽柄的尺寸 */
  getHandlerSize() {
    return this.handleSize
  }

  /** 获取当前是第几个面板 */
  getPaneIndex($pane: BlSplitterPane) {
    return this.panes.indexOf($pane)
  }

  /** 调整 pane 的尺寸 */
  resizePane($pane: BlSplitterPane, newSize: number) {
    const panes = this.panes
    // 面板是冻结的的，意味着不能调整尺寸，退出
    if (this.isSizeFrozen($pane)) return

    // 1. 当前面板不存在，直接退出
    // 2. 当前是第一个面板，也直接退出（调整当前面板，需要将调整值取反分配给前一个面板，当前没有前一个面板）
    const index = panes.indexOf($pane)
    if (index < 1) return

    const $prevPane = panes[index - 1]
    // 上一个面板是冻结的的，意味着不能调整尺寸，退出
    if (this.isSizeFrozen($prevPane)) return

    // 当前面板与上一个面板的尺寸合计
    const totalSize = $pane.size + $prevPane.size

    const splitterSize = this.size

    // 确保调整后的尺寸不溢出
    // 1. 面板不能小于面板的 min 设置，上一个面板不能因此大于上个面板的 max
    // 2. 面板不能大于外容器，也不能大于面板的 max 设置，上一个面板不能因此小于上个面板的 min
    const min = $pane.min
    const max = Math.min(splitterSize, $pane.max)
    const prevMin = $prevPane.min
    const prevMax = Math.min(splitterSize, $prevPane.max)

    let prevNewSize = totalSize - newSize

    if (newSize < min) {
      newSize = min
      prevNewSize = totalSize - newSize
    }
    if (prevNewSize < prevMin) {
      prevNewSize = prevMin
      newSize = totalSize - prevNewSize
    }
    if (newSize > max) {
      newSize = max
      prevNewSize = totalSize - newSize
    }
    if (prevNewSize > prevMax) {
      prevNewSize = prevMax
      newSize = totalSize - prevNewSize
    }

    const offset = newSize - $pane.size
    $pane.size = newSize
    $prevPane.size = prevNewSize

    $prevPane.updateStyle()
    $pane.updateStyle()

    dispatchEvent(this, 'pane-resized', {
      detail: { offset, $pane, $prevPane },
    })

    // 往 右/下 拖拽
    if (offset < 0) {
      // 面板完全折叠
      if ($pane.size <= min) {
        dispatchEvent(this, 'pane-close', { detail: { $pane } })
      }
      // 前一个面板从折叠到展开
      if ($prevPane.size === prevMin - offset) {
        dispatchEvent(this, 'pane-open', { detail: { $pane: $prevPane } })
      }
    }

    // 往 左/上 拖拽
    if (offset > 0) {
      // 面板从折叠到展开
      if ($pane.size === offset + min) {
        dispatchEvent(this, 'pane-open', { detail: { $pane } })
      }
      // 前一个面板完全折叠
      if ($prevPane.size <= prevMin) {
        dispatchEvent(this, 'pane-close', { detail: { $pane: $prevPane } })
      }
    }
  }

  // 折叠面板到最小尺寸
  collapsePane($pane: BlSplitterPane) {
    $pane.collapseSize = $pane.size
    this.resizePane($pane, 0)
  }

  // 展开面板
  expandPane($pane: BlSplitterPane) {
    this.resizePane($pane, $pane.collapseSize || 0)
  }

  layout() {
    // 统计当前所有 pane 的尺寸总和
    const sum = this.panes.reduce((acc, $pane) => acc + $pane.size, 0)

    // 未分配的尺寸（容器宽高 - 已分配的宽高）
    const rest = this.size - sum

    // 没有未分配的尺寸，无需调整
    if (rest === 0) {
      this.panes.forEach($pane => $pane.updateStyle())
      this.renderHandles()
      dispatchEvent(this, 'layout')
      return
    }

    // 未分配的尺寸大于 0，说明扩张了，则需要将这些尺寸加在各个 pane 上
    if (rest > 0) {
      this._growPanes(rest, this.panes)
      dispatchEvent(this, 'layout')
      return
    }

    // 未分配的尺寸小于 0，说明收缩了，需要将这些收缩量分配到 pane 上
    this._shrinkPanes(-rest, this.panes)
    dispatchEvent(this, 'layout')
  }

  setActiveHandle($pane: BlSplitterPane) {
    this.clearActiveHandle()
    const index = this.getPaneIndex($pane)
    this.handles[index] && this.handles[index].classList.add('active')
    this.handles[index - 1] && this.handles[index - 1].classList.add('active')
  }

  clearActiveHandle() {
    this.handles.forEach($handle => $handle.classList.remove('active'))
  }

  getHandleIndex($handle: HTMLElement) {
    return Array.prototype.indexOf.call(this.$layout.querySelectorAll('.handle'), $handle)
  }

  #setupSlotEvent() {
    const onSlotChange = () => {
      this.panes = this.$slot.assignedElements().filter($item => $item instanceof BlSplitterPane) as BlSplitterPane[]
      this._renderDirection()
      this.layout()
    }
    this.hook.onConnected(() => {
      this.$slot.addEventListener('slotchange', onSlotChange)
    })
    this.hook.onDisconnected(() => {
      this.$slot.removeEventListener('slotchange', onSlotChange)
    })
  }

  #setupResizeEvents() {
    // 开始拖拽调整面板尺寸时，鼠标的坐标，以及面板宽度初始值
    // 用于计算偏移
    let startSize = 0
    let $handle: HTMLElement | null = null
    let $pane: BlSplitterPane | null = null

    onDragMove(this.$layout, {
      onStart: ({ stop, $target }) => {
        if (!$target.classList.contains('handle')) {
          return stop()
        }
        $handle = $target
        $pane = this.panes[this.getHandleIndex($handle) + 1]
        ;(startSize = $pane.size), this.toggleCover(true)
        $handle.classList.add('dragging')
      },

      onMove: ({ offset }) => {
        const axis = this.direction === 'horizontal' ? 'x' : 'y'
        const mouseOffset = offset[axis]
        const newSize = startSize - mouseOffset
        this.resizePane($pane!, newSize)
        this.renderHandles()
      },

      onEnd: () => {
        this.toggleCover(false)
        $handle!.classList.remove('dragging')
        $handle = null
        $pane = null
      },

      onCancel: () => {
        this.toggleCover(false)
        $handle!.classList.remove('dragging')
        $handle = null
        $pane = null
      },
    })
  }

  // 获取面板允许扩张的尺寸
  _getGrowSize($pane: BlSplitterPane) {
    if (this.isSizeFrozen($pane)) return 0
    if ($pane.grow <= 0) return 0
    return $pane.max - $pane.size
  }

  // 获取面板允许收缩的尺寸
  _getShrinkSize($pane: BlSplitterPane) {
    if (this.isSizeFrozen($pane)) return 0
    if ($pane.shrink <= 0) return 0
    return $pane.max - $pane.size
  }

  // 将 rest 尺寸分配到 panes 上
  _growPanes(rest: number, panes: BlSplitterPane[]) {
    let refresh = false
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest: number, panes: BlSplitterPane[]) => {
      // 找出能接纳扩张的 pane
      const $list = panes.filter($pane => this._getGrowSize($pane) >= 1)
      if (!$list.length) return
      refresh = true

      const totalGrow = $list.reduce((acc, $pane) => acc + $pane.grow, 0)
      const growSizes = $list.map($pane => ($pane.grow / totalGrow) * rest)
      $list.forEach(($pane, index) => {
        const growSize = growSizes[index]
        // 实际扩张的尺寸
        const actual = Math.min(this._getGrowSize($pane), growSize)
        $pane.size += actual
        rest -= actual
      })

      // 还有未分配的尺寸（由于不处理精度问题，不用零判断），下一轮递归
      if (rest >= 1) {
        loop(rest, $list)
      }
    }
    loop(rest, panes)
    if (refresh) {
      panes.forEach($pane => $pane.updateStyle())
      this.renderHandles()
    }
  }

  _shrinkPanes(rest: number, panes: BlSplitterPane[]) {
    let refresh = false
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest: number, panes: BlSplitterPane[]) => {
      // 找出能接纳收缩的 pane
      const $list = panes.filter($pane => this._getShrinkSize($pane) >= 1)
      if (!$list.length) return
      refresh = true

      const totalShrink = $list.reduce((acc, $pane) => acc + $pane.shrink, 0)
      const shrinkSizes = $list.map($pane => ($pane.shrink / totalShrink) * rest)
      $list.forEach(($pane, index) => {
        const shrinkSize = shrinkSizes[index]
        // 实际收缩的尺寸
        const actual = Math.min(this._getShrinkSize($pane), shrinkSize)
        $pane.size -= actual
        rest -= actual
        $pane.updateStyle()
      })

      // 还有未分配的尺寸（由于不处理精度问题，不用零判断），下一轮递归
      if (rest >= 1) {
        loop(rest, $list)
      }
    }
    loop(rest, panes)
    if (refresh) {
      panes.forEach($pane => $pane.updateStyle())
      this.renderHandles()
    }
  }

  // 显示遮罩，这是为了避免某个 pane 里面存在 iframe， 捕获了鼠标，导致 mousemove 事件无法正确工作
  toggleCover(visible: boolean) {
    this.$cover.style.display = visible ? 'block' : 'none'
  }
}
