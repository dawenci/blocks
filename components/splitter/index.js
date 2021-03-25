import { dispatchEvent } from '../../common/event.js'
import { enumGetter, enumSetter, intGetter, intSetter, numGetter, numSetter } from '../../common/property.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_base, __border_color_light, __color_primary, __color_primary_light } from '../../theme/var.js'

const TEMPLATE = `<style>
:host {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border-color-base, ${__border_color_base});
}
#layout {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#panes {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#cover {
  display: none;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
:host(:not([direction])) #cover,
:host([direction="horizontal"]) #cover {
  cursor: col-resize;
}
:host([direction="vertical"]) #cover {
  cursor: row-resize;
}

:host(:not([direction])) #layout,
:host([direction="horizontal"]) #layout {
  flex-direction: row;
}
:host([direction="vertical"]) #layout {
  flex-direction: column;
}

.handle {
  box-sizing: border-box;
  position: absolute;
  display: block;
  user-select: none;
}
.handle.active,
.handle:hover,
.handle.dragging {
  z-index: 1;
}
.handle::before {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}
.handle::after {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 1px;
  height: 1px;
}
.handle:hover::before,
.handle.dragging::before {
  background-color: var(--color-primary-light, ${__color_primary_light});
  opacity: .5;
}
.handle:hover::after,
.handle.dragging::after {
  background-color: var(--color-primary-light, ${__color_primary_light});
}

:host(:not([direction])) .handle,
:host([direction="horizontal"]) .handle {
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
  height: 100%;
  border-top: 0;
  border-bottom: 0;
  cursor: col-resize;
}
:host(:not([direction])) .handle::after,
:host([direction="horizontal"]) .handle::after {
  height: 100%;
}
:host([direction="vertical"]) .handle {
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
  width: 100%;
  border-left: 0;
  border-right: 0;
  cursor: row-resize;
}
:host([direction="vertical"]) .handle::after {
  width: 100%;
}
</style>

<div id="layout">
  <div id="panes"><slot></slot></div>
  <div id="cover"></div>
</div>
`

const PANE_TEMPLATE = `<style>
:host {
  display: block;
  position: absolute;
  box-sizing: border-box;
}
:host(.horizontal) {
  height: 100%;
  width: auto;
}
:host(.vertical) {
  width: 100%;
  height: auto;
}
#content {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
<div id="content" part="content"><slot></slot></div>
`

const template = document.createElement('template')
const paneTemplate = document.createElement('template')
template.innerHTML = TEMPLATE
paneTemplate.innerHTML = PANE_TEMPLATE

const $handleTemplate = document.createElement('div')
$handleTemplate.className = 'handle'

export class BlocksSplitter extends HTMLElement {
  static get observedAttributes() {
    return ['direction', 'handle-size']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$panes = shadowRoot.getElementById('panes')
    this.$cover = shadowRoot.getElementById('cover')
    this.$slot = this.$panes.querySelector('slot')

    this.panes = []

    this.$slot.addEventListener('slotchange', e => {
      this.panes = this.$slot.assignedElements()
      this.panes.forEach($pane => {
        $pane.classList.toggle('horizontal', this.direction === 'horizontal')
        $pane.classList.toggle('vertical', this.direction === 'vertical')
      })
      this.layout()
    })

    this._initResizeEvents()
  }

  get direction() {
    return enumGetter('direction', [null, 'horizontal', 'vertical'])(this) ?? 'horizontal'
  }

  set direction(value) {
    enumSetter('direction', [null, 'horizontal', 'vertical'])(this, value)
  }

  get handleSize() {
    return intGetter('handle-size', 6)(this)
  }

  set handleSize(value) {
    intSetter('handle-size')(this, value)
  }

  get size() {
    return this.$panes[this.direction === 'horizontal' ? 'clientWidth' : 'clientHeight']
  }

  render() {}

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()

    this._offSizeObserve = sizeObserve(this, this.layout.bind(this))
  }

  disconnectedCallback() {
    this._offSizeObserve()
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}

  renderHandles() {
    const count = this.panes.length - 1
    let len = this.$layout.querySelectorAll('.handle').length
    while (len++ < count) {
      this.$layout.insertBefore($handleTemplate.cloneNode(true), this.$cover)
    }
    len = this.$layout.querySelectorAll('.handle').length
    while (len-- > count) {
      this.$layout.removeChild(this.$layout.querySelector('.handle'))
    }
    this.handles = Array.prototype.slice.call(this.$layout.querySelectorAll('.handle'))
    this.handles.forEach(($handle, index) => {
      const offset = this.getPanePosition(this.panes[index + 1]) - this.handleSize / 2
      const sizeProp = this.direction === 'horizontal' ? 'width' : 'height'
      const posProp = this.direction === 'horizontal' ? 'left' : 'top'
      $handle.style.cssText = `${sizeProp}:${this.handleSize}px;${posProp}:${offset}px;`
    })
  }

  /** 计算 pane 的尺寸 */
  getPaneSize($pane) {
    let size = $pane.size || 0
    size = Math.max(size, $pane.min)
    size = Math.min(size, $pane.max)
    return size
  }

  /** 检测面板是否冻结尺寸不允许调整 */
  isSizeFrozen($pane) {
    return $pane.max === $pane.min
  }

  /** 计算 pane 的定位 */
  getPanePosition($pane) {
    if (this.panes.length) {
      const index = this.panes.indexOf($pane)
      if (index !== -1) {
        return this.panes.slice(0, index)
          .reduce((acc, pane) => {
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
  getPaneIndex($pane) {
    return this.panes.indexOf($pane)
  }

  /** 调整 pane 的尺寸 */
  resizePane($pane, newSize) {
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

    dispatchEvent(this, 'pane-resized', { detail: { offset, $pane, $prevPane } } )

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
  collapsePane($pane) {
    $pane.collapseSize = $pane.size
    this.resizePane($pane, 0)
  }

  // 展开面板
  expandPane($pane) {
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

  setActiveHandle($pane) {
    this.clearActiveHandle()
    let index = this.getPaneIndex($pane)
    this.handles[index] && this.handles[index].classList.add('active')
    this.handles[index - 1] && this.handles[index - 1].classList.add('active')
  }

  clearActiveHandle() {
    this.handles.forEach($handle => $handle.classList.remove('active'))
  }

  gethandleIndex($handle) {
    return Array.prototype.indexOf.call(this.$layout.querySelectorAll('.handle'), $handle)
  }

  _initResizeEvents() {
    // 开始拖拽调整面板尺寸时，鼠标的坐标，以及面板宽度初始值
    // 用于计算偏移
    let resizeStart = { x: 0, y: 0, size: 0 }

    // 拖拽调整面板尺寸过程，鼠标坐标
    let mouseCurrent = { x: 0, y: 0 }

    let $handle = null
    let $pane = null

    const clear = () => {
      document.removeEventListener('mousemove', onmove)
      document.removeEventListener('mouseup', onup)
      this.toggleCover(false)
      $handle.classList.remove('dragging')
      $handle = null
      $pane = null
    }

    const onmove = e => {
      mouseCurrent = { x: e.pageX, y: e.pageY }
      // 鼠标离开窗口的时候，退出
      const $from = e.relatedTarget || e.toElement
      if (!$from || $from.nodeName === 'HTML') {
        clear()
        return
      }

      // 刷新
      const axis = this.direction === 'horizontal' ? 'x' : 'y'
      const mouseOffset = mouseCurrent[axis] - resizeStart[axis]
      const newSize = resizeStart.size - mouseOffset
      this.resizePane($pane, newSize)
      this.renderHandles()
    }

    const onup = () => {
      clear()
    }

    const onstart = (e) => {
      if (!e.target.classList.contains('handle')) return
      $handle = e.target
      $pane = this.panes[this.gethandleIndex($handle) + 1]
      resizeStart = {
        x: e.pageX,
        y: e.pageY,
        size: $pane.size,
      }
      mouseCurrent = {
        x: e.pageX,
        y: e.pageY
      }

      document.addEventListener('mousemove', onmove)
      document.addEventListener('mouseup', onup)
      this.toggleCover(true)
      $handle.classList.add('dragging')
    }

    this.$layout.onmousedown = onstart
  }

  // 获取面板允许扩张的尺寸
  _getGrowSize($pane) {
    if (this.isSizeFrozen($pane)) return 0
    if ($pane.grow <= 0) return 0
    return $pane.max - $pane.size
  }

  // 获取面板允许收缩的尺寸
  _getShrinkSize($pane) {
    if (this.isSizeFrozen($pane)) return 0
    if ($pane.shrink <= 0) return 0
    return $pane.max - $pane.size
  }

  // 将 rest 尺寸分配到 panes 上
  _growPanes(rest, panes) {
    let refresh = false
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest, panes) => {
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

  _shrinkPanes(rest, panes) {
    let refresh = false
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest, panes) => {
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
  toggleCover(visible) {
    this.$cover.style.display = visible ? 'block' : 'none'
  }
}

export class BlocksSplitterPane extends HTMLElement {
  static get observedAttributes() {
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

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(paneTemplate.content.cloneNode(true))
    this.addEventListener('mouseenter', () => {
      this.$splitter.setActiveHandle(this)
    })
  }

  get basis() {
    return numGetter('basis')(this)
  }

  set basis(value) {
    numSetter('basis')(this, value)
  }

  get grow() {
    return numGetter('grow', 1)(this)
  }

  set grow(value) {
    numSetter('grow')(this, value)
  }

  get shrink() {
    return numGetter('shrink', 1)(this)
  }

  set shrink(value) {
    numSetter('shrink')(this, value)
  }

  get max() {
    return intGetter('max', Infinity)(this)
  }

  set max(value) {
    intSetter('max')(this, value)
  }

  get min() {
    return intGetter('min', 0)(this)
  }

  set min(value) {
    intSetter('min')(this, value)
  }

  get $splitter() {
    return this.closest('bl-splitter')
  }

  get size() {
    return this._size ?? this.basis
  }

  set size(value) {
    this._size = value
  }

  updateStyle() {
    const sizeProp = this.$splitter.direction === 'horizontal' ? 'width' : 'height'
    const posProp = this.$splitter.direction === 'horizontal' ? 'left' : 'top'
    // 宽度/高度 样式计算，外框宽度 - 拖动柄的宽度（如果显示拖动柄）
    this.style[sizeProp] = this.$splitter.getPaneSize(this) + 'px'
    this.style[posProp] = this.$splitter.getPanePosition(this) + 'px'
  }

  render() {}

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}

  collapse() {
    this.collapsePane(this)
  }

  expand() {
    this.expandPane(this)
  }
}

if (!customElements.get('bl-splitter')) {
  customElements.define('bl-splitter', BlocksSplitter)
}

if (!customElements.get('bl-splitter-pane')) {
  customElements.define('bl-splitter-pane', BlocksSplitterPane)
}
