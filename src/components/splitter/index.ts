import { dispatchEvent } from '../../common/event.js'
import { onDragMove } from '../../common/onDragMove.js'
import {
  enumGetter,
  enumSetter,
  intGetter,
  intSetter,
  numGetter,
  numSetter,
} from '../../common/property.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'
import type { EnumAttr } from '../../decorators/attr.js'

export interface BlocksSplitter extends Component {
  _ref: {
    $layout: HTMLElement
    $panes: HTMLElement
    $cover: HTMLElement
    $slot: HTMLSlotElement
  }
}

@customElement('bl-splitter')
export class BlocksSplitter extends Component {
  panes: BlocksSplitterPane[] = []
  handles: HTMLElement[] = []

  static override get observedAttributes() {
    return ['direction', 'handle-size']
  }

  @attr('enum', { enumValues: ['horizontal', 'vertical'] })
  accessor direction: EnumAttr<['horizontal', 'vertical']> = 'horizontal'

  @attr('int') accessor handleSize = 6

  constructor() {
    super()
    const { comTemplate } = template()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(comTemplate.content.cloneNode(true))
    const $layout = shadowRoot.getElementById('layout') as HTMLElement
    const $panes = shadowRoot.getElementById('panes') as HTMLElement
    const $cover = shadowRoot.getElementById('cover') as HTMLElement
    const $slot = $panes.querySelector('slot')!

    this._ref = { $layout, $panes, $cover, $slot }

    $slot.addEventListener('slotchange', () => {
      this.panes = $slot
        .assignedElements()
        .filter(
          $item => $item instanceof BlocksSplitterPane
        ) as BlocksSplitterPane[]

      this._renderDirection()
      this.layout()
    })

    this._initResizeEvents()
  }

  _renderDirection() {
    this.panes.forEach($pane => {
      $pane.classList.toggle('horizontal', this.direction === 'horizontal')
      $pane.classList.toggle('vertical', this.direction === 'vertical')
    })
  }

  get size() {
    return this._ref.$panes[
      this.direction === 'horizontal' ? 'clientWidth' : 'clientHeight'
    ]
  }

  _offSizeObserve?: () => void
  override connectedCallback() {
    super.connectedCallback()
    this.render()
    this._offSizeObserve = sizeObserve(this, this.layout.bind(this))
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this._offSizeObserve) {
      this._offSizeObserve()
      this._offSizeObserve = undefined
    }
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (attrName === 'direction') {
      this._renderDirection()
    }
    if (attrName === 'handle-size') {
      this.layout()
    }
  }

  renderHandles() {
    const { $layout, $cover } = this._ref
    const count = this.panes.length - 1
    let len = $layout.querySelectorAll('.handle').length
    const { $handleTemplate } = template()
    while (len++ < count) {
      $layout.insertBefore($handleTemplate.cloneNode(true), $cover)
    }
    len = $layout.querySelectorAll('.handle').length
    while (len-- > count) {
      $layout.removeChild($layout.querySelector('.handle')!)
    }
    this.handles = Array.prototype.slice.call(
      $layout.querySelectorAll('.handle')
    )
    this.handles.forEach(($handle, index) => {
      const offset =
        this.getPanePosition(this.panes[index + 1]) - this.handleSize / 2
      const sizeProp = this.direction === 'horizontal' ? 'width' : 'height'
      const posProp = this.direction === 'horizontal' ? 'left' : 'top'
      $handle.style.cssText = `${sizeProp}:${this.handleSize}px;${posProp}:${offset}px;`
    })
  }

  /** 计算 pane 的尺寸 */
  getPaneSize($pane: BlocksSplitterPane) {
    let size = $pane.size || 0
    size = Math.max(size, $pane.min)
    size = Math.min(size, $pane.max)
    return size
  }

  /** 检测面板是否冻结尺寸不允许调整 */
  isSizeFrozen($pane: BlocksSplitterPane) {
    return $pane.max === $pane.min
  }

  /** 计算 pane 的定位 */
  getPanePosition($pane: BlocksSplitterPane) {
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
  getPaneIndex($pane: BlocksSplitterPane) {
    return this.panes.indexOf($pane)
  }

  /** 调整 pane 的尺寸 */
  resizePane($pane: BlocksSplitterPane, newSize: number) {
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
  collapsePane($pane: BlocksSplitterPane) {
    $pane.collapseSize = $pane.size
    this.resizePane($pane, 0)
  }

  // 展开面板
  expandPane($pane: BlocksSplitterPane) {
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

  setActiveHandle($pane: BlocksSplitterPane) {
    this.clearActiveHandle()
    const index = this.getPaneIndex($pane)
    this.handles[index] && this.handles[index].classList.add('active')
    this.handles[index - 1] && this.handles[index - 1].classList.add('active')
  }

  clearActiveHandle() {
    this.handles.forEach($handle => $handle.classList.remove('active'))
  }

  getHandleIndex($handle: HTMLElement) {
    return Array.prototype.indexOf.call(
      this._ref.$layout.querySelectorAll('.handle'),
      $handle
    )
  }

  _initResizeEvents() {
    // 开始拖拽调整面板尺寸时，鼠标的坐标，以及面板宽度初始值
    // 用于计算偏移
    let startSize = 0
    let $handle: HTMLElement | null = null
    let $pane: BlocksSplitterPane | null = null

    onDragMove(this._ref.$layout, {
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
  _getGrowSize($pane: BlocksSplitterPane) {
    if (this.isSizeFrozen($pane)) return 0
    if ($pane.grow <= 0) return 0
    return $pane.max - $pane.size
  }

  // 获取面板允许收缩的尺寸
  _getShrinkSize($pane: BlocksSplitterPane) {
    if (this.isSizeFrozen($pane)) return 0
    if ($pane.shrink <= 0) return 0
    return $pane.max - $pane.size
  }

  // 将 rest 尺寸分配到 panes 上
  _growPanes(rest: number, panes: BlocksSplitterPane[]) {
    let refresh = false
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest: number, panes: BlocksSplitterPane[]) => {
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

  _shrinkPanes(rest: number, panes: BlocksSplitterPane[]) {
    let refresh = false
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest: number, panes: BlocksSplitterPane[]) => {
      // 找出能接纳收缩的 pane
      const $list = panes.filter($pane => this._getShrinkSize($pane) >= 1)
      if (!$list.length) return
      refresh = true

      const totalShrink = $list.reduce((acc, $pane) => acc + $pane.shrink, 0)
      const shrinkSizes = $list.map(
        $pane => ($pane.shrink / totalShrink) * rest
      )
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
    this._ref.$cover.style.display = visible ? 'block' : 'none'
  }
}

@customElement('bl-splitter-pane')
export class BlocksSplitterPane extends Component {
  static override get observedAttributes() {
    return [
      // 弹性尺寸基础值
      'basis',
      // 弹性尺寸增长率
      'grow',
      // 最大尺寸
      'max',
      // 最小尺寸
      'min',
      // 弹性尺寸收缩率
      'shrink',
    ]
  }

  @attr('number') accessor basis = 0

  @attr('number') accessor grow = 1

  @attr('number') accessor shrink = 1

  @attr('number') accessor max = Infinity

  @attr('number') accessor min = 0

  collapseSize?: number

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    const { paneTemplate } = template()
    shadowRoot.appendChild(paneTemplate.content.cloneNode(true))
    this.addEventListener('mouseenter', () => {
      this.getSplitter().setActiveHandle(this)
    })
  }

  _size?: number | null
  get size() {
    return this._size ?? this.basis
  }

  set size(value) {
    this._size = value
  }

  getSplitter() {
    return this.closest('bl-splitter')!
  }

  updateStyle() {
    const sizeProp =
      this.getSplitter().direction === 'horizontal' ? 'width' : 'height'
    const posProp =
      this.getSplitter().direction === 'horizontal' ? 'left' : 'top'
    // 宽度/高度 样式计算，外框宽度 - 拖动柄的宽度（如果显示拖动柄）
    this.style[sizeProp] = this.getSplitter().getPaneSize(this) + 'px'
    this.style[posProp] = this.getSplitter().getPanePosition(this) + 'px'
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  collapse() {
    this.getSplitter().collapsePane(this)
  }

  expand() {
    this.getSplitter().expandPane(this)
  }
}
