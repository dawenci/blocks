import { dispatchEvent } from '../../common/event.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter, numGetter, numSetter } from '../../common/property.js'
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

:host([direction="row"]) #layout {
  flex-direction: row;
}
:host([direction="column"]) #layout {
  flex-direction: column;
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
:host(.row) {
  height: 100%;
  width: auto;
}
:host(.column) {
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
#handle {
  box-sizing: border-box;
  position: absolute;
  display: block;
  user-select: none;
  border: 1px solid rgba(0,0,0,.1);
  background-color: rgba(0,0,0,.025);
}
#handle::before {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 2px;
  height: 2px;
  border-radius: 2px;
}
#handle:hover,
#handle.dragging {
  border-color: var(--color-primary-light, ${__color_primary});
  background-color: var(--color-primary-light, ${__color_primary_light});
}
#handle:hover::before,
#handle.dragging::before {
  background-color: #fff;
}

:host(.row) #handle {
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
  height: 100%;
  border-top: 0;
  border-bottom: 0;
  cursor: col-resize; 
}
:host(.row) #handle::before {
  height: 30px;
}
:host(.column) #handle {
  top: 0;
  right: auto;
  bottom: auto;
  left: 0;
  width: 100%;
  border-left: 0;
  border-right: 0;
  cursor: row-resize;
}
:host(.column) #handle::before {
  width: 30px;
}
/* 第一个一个面板不显示拖动柄 */
:host(:first-child) #handle {
  display: none;
}
:host(.row:first-child) #handle {
  padding-left: 0;
}
:host(.column:first-child) #handle {
  padding-top: 0;
}
</style>
<div id="content" part="content"><slot></slot></div>
<div id="handle" part="handle"></div>
`


const template = document.createElement('template')
const paneTemplate = document.createElement('template')
template.innerHTML = TEMPLATE
paneTemplate.innerHTML = PANE_TEMPLATE


export class BlocksSplitter extends HTMLElement {
  static get observedAttributes() {
    return ['direction', 'handleSize']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$panes = shadowRoot.getElementById('panes')
    this.$cover = shadowRoot.getElementById('cover')
    this.$slot = this.$panes.querySelector('slot')

    this.splitterStore = {
      // 显示遮罩，这是为了避免某个 pane 里面存在 iframe， 捕获了鼠标，导致 mousemove 事件无法正确工作
      cover: false,
      width: 0,
      height: 0,
      panes: [],
      prop: this.direction === 'row' ? 'width' : 'height',
      from: this.direction === 'row' ? 'left' : 'top',
      axis: this.direction === 'row' ? 'x' : 'y',
    }

    this.$slot.addEventListener('slotchange', e => {
      this.splitterStore.panes = this.$slot.assignedElements()
      this.splitterStore.panes.forEach($pane => {
        $pane.classList.toggle('row', this.direction === 'row')
        $pane.classList.toggle('column', this.direction === 'column')
        $pane.updateStyle()
      })
    })
  }

  get direction() {
    return enumGetter('direction', [null, 'row', 'column'])(this) ?? 'row'
  }

  set direction(value) {
    enumSetter('direction', [null, 'row', 'column'])(this, value)
  }

  get handleSize() {
    return intGetter('handle-size', 6)(this)
  }

  set handleSize(value) {
    intSetter('handle-size')(this, value)
  }

  updatePaneStyle($pane) {
    $pane.updateStyle()
  }

  /** 计算 pane 的尺寸 */
  getPaneSize($pane) {
    let size = $pane.size || 0
    size = Math.max(size, $pane.min, this.splitterStore.panes[0] === $pane ? 0 : this.handleSize)
    size = Math.min(size, $pane.max)
    return size
  }

  /** 检测面板是否冻结尺寸不允许调整 */
  isSizeFrozen($pane) {
    return $pane.max === $pane.min
  }

  /** 计算 pane 的定位 */
  getPanePosition($pane) {
    if (this.splitterStore && this.splitterStore.panes) {
      const index = this.splitterStore.panes.indexOf($pane)
      if (index !== -1) {
        return this.splitterStore.panes.slice(0, index)
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
  getPaneIndex(pane) {
    return this.splitterStore.panes.indexOf(pane)
  }

  /** 调整 pane 的尺寸 */
  resizePane($pane, newSize) {
    const panes = this.splitterStore.panes
    // 面板是冻结的的，意味着不能调整尺寸，退出
    if (this.isSizeFrozen($pane)) return

    // 1. 当前面板不存在，直接退出
    // 2. 当前是第一个面板，也直接退出（调整当前面板，需要将调整值取反分配给前一个面板，当前没有前一个面板）
    const index = panes.indexOf($pane)
    if (index < 1) return

    const prevPane = panes[index - 1]
    // 上一个面板是冻结的的，意味着不能调整尺寸，退出
    if (this.isSizeFrozen(prevPane)) return

    // 当前面板与上一个面板的尺寸合计
    const totalSize = $pane.size + prevPane.size

    const handleSize = this.handleSize
    const splitterSize = this.splitterStore[this.splitterStore.prop]

    // 确保调整后的尺寸不溢出
    // 1. 面板不能小于拖拽柄，也不能小于面板的 min 设置，上一个面板不能因此大于上个面板的 max
    // 2. 面板不能大于外容器，也不能大于面板的 max 设置，上一个面板不能因此小于上个面板的 min
    const min = Math.max(handleSize, $pane.min || handleSize)
    const max = Math.min(splitterSize, $pane.max || splitterSize)
    const prevMin = Math.max((index === 1 ? 0 : handleSize), prevPane?.min ?? 0)
    const prevMax = Math.min(splitterSize, prevPane?.max ?? splitterSize)

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
    prevPane.size = prevNewSize

    prevPane.updateStyle()
    $pane.updateStyle()

    dispatchEvent(this, 'pane-resized', { detail: { offset, pane: $pane, prevPane } } )

    // 往 右/下 拖拽
    if (offset < 0) {
      // 面板完全折叠
      if ($pane.size <= min) {
        dispatchEvent(this, 'pane-close', { detail: { pane: $pane } })
      }
      // 前一个面板从折叠到展开
      if (prevPane.size === prevMin - offset) {
        dispatchEvent(this, 'pane-open', { detail: { pane: prevPane } })
      }
    }

    // 往 左/上 拖拽
    if (offset > 0) {
      // 面板从折叠到展开
      if ($pane.size === offset + min) {
        dispatchEvent(this, 'pane-open', { detail: { pane: $pane } })
      }
      // 前一个面板完全折叠
      if (prevPane.size <= prevMin) {
        dispatchEvent(this, 'pane-close', { detail: { pane: prevPane } })
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
    const splitterStore = this.splitterStore
    // 容器宽高
    this.splitterStore.width = this.$panes.clientWidth
    this.splitterStore.height = this.$panes.clientHeight

    // 确认将要调整的是 pane 的 width 还是 height
    const prop = splitterStore.prop

    // 统计当前所有 pane 的尺寸总和
    const sum = splitterStore.panes.reduce((acc, pane) => {
      return acc + pane.size
    }, 0)

    // 未分配的尺寸
    const rest = splitterStore[prop] - sum

    // 没有未分配的尺寸，无需调整
    if (rest === 0) {
      dispatchEvent(this, 'layout', { detail: { store: this.splitterStore } } )
      return
    }

    // 未分配的尺寸大于 0，说明扩张了，则需要将这些尺寸加在各个 pane 上
    if (rest > 0) {
      this._growPanes(rest, splitterStore.panes)
      dispatchEvent(this, 'layout', { detail: { store: this.splitterStore } } )
      return
    }

    // 未分配的尺寸小于 0，说明收缩了，需要将这些收缩量分配到 pane 上
    this._shrinkPanes(-rest, splitterStore.panes)

    dispatchEvent(this, 'layout', { detail: { store: this.splitterStore } } )
  }

  // 获取面板允许扩张的尺寸
  _getGrowSize($pane) {
    if (this.isSizeFrozen($pane)) return 0
    if ($pane.grow <= 0) return 0
    return $pane.max - Math.max($pane.size, this.handleSize)
  }

  // 获取面板允许收缩的尺寸
  _getShrinkSize($pane) {
    if (this.isSizeFrozen($pane)) return 0
    if ($pane.shrink <= 0) return 0
    return $pane.max - Math.max($pane.size, this.handleSize)
  }

  // 将 rest 尺寸分配到 panes 上
  _growPanes(rest, $panes) {
    let refresh = false
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest, $panes) => {
      // 找出能接纳扩张的 pane
      const $list = $panes.filter($pane => {
        return this._getGrowSize($pane) >= 1
      })
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
    loop(rest, $panes)
    if (refresh) {
      $panes.forEach($pane => $pane.updateStyle())
    }
  }

  _shrinkPanes(rest, $panes) {
    let refresh = false
    // 递归处理，返回一趟处理完毕剩余未分配的尺寸
    const loop = (rest, panes) => {
      // 找出能接纳收缩的 pane
      const $list = panes.filter(pane => {
        return this._getShrinkSize(pane) >= 1
      })
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
    loop(rest, $panes)
    if (refresh) {
      $panes.forEach($pane => $pane.updateStyle())
    }
  }

  _onDirectionChange(value) {
    this.splitterStore.prop = value === 'row' ? 'width' : 'height'
    this.splitterStore.from = value === 'row' ? 'left' : 'top'
    this.splitterStore.axis = value === 'row' ? 'x' : 'y'
  }

  toggleCover(visible) {
    this.$cover.style.display = visible ? 'block' : 'none'
  }

  render() {}

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()

    this.layout()
    this._offSizeObserve = sizeObserve(this, this.layout.bind(this))
  }

  disconnectedCallback() {
    this._offSizeObserve()
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'direction') {
      this._onDirectionChange()
    }
  }
}



export class BlocksSplitterPane extends HTMLElement {
  static get observedAttributes() {
    return [
      // 最大尺寸
      'max',
      // 最小尺寸
      'min',
      // 弹性尺寸基础值
      'basis',
      // 弹性尺寸增长率
      'grow',
      // 弹性尺寸收缩率
      'shrink',
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(paneTemplate.content.cloneNode(true))
    this.$content = shadowRoot.getElementById('content')
    this.$handle = shadowRoot.getElementById('handle')

    // 开始拖拽调整面板尺寸时，鼠标的坐标，以及面板宽度初始值
    // 用于计算偏移
    this.resizeStart = {
      x: 0,
      y: 0,
      size: 0,
    }

    // 拖拽调整面板尺寸过程，鼠标坐标
    this.mouseCurrent = {
      x: 0,
      y: 0,
    }

    const clear = () => {
      document.removeEventListener('mousemove', onmove)
      document.removeEventListener('mouseup', onup)
      this.$splitter.toggleCover(false)
      this.$handle.classList.remove('dragging')
    }

    const onmove = e => {
      this.mouseCurrent = { x: e.pageX, y: e.pageY }
      // 鼠标离开窗口的时候，退出
      const from = e.relatedTarget || e.toElement
      if (!from || from.nodeName === 'HTML') {
        clear()
      }

      // 刷新
      const axis = this.$splitter.splitterStore.axis
      const mouseOffset = this.mouseCurrent[axis] - this.resizeStart[axis]
      const newSize = this.resizeStart.size - mouseOffset
      this.$splitter.resizePane(this, newSize)
    }

    const onup = () => {
      clear()
    }

    const onstart = (e) => {
      this.resizeStart = {
        x: e.pageX,
        y: e.pageY,
        size: this.size,
      }
      this.mouseCurrent = {
        x: e.pageX,
        y: e.pageY
      }

      document.addEventListener('mousemove', onmove)
      document.addEventListener('mouseup', onup)
      this.$splitter.toggleCover(true)
      this.$handle.classList.add('dragging')
    }

    this.$handle.onmousedown = onstart
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
    const store = this.$splitter.splitterStore
    const isFirstPane = store.panes[0] === this

    // 宽度/高度 样式计算，外框宽度 - 拖动柄的宽度（如果显示拖动柄）
    this.$content.style[store.prop] = isFirstPane
      ? this.$splitter.getPaneSize(this) + 'px'
      : (this.$splitter.getPaneSize(this) - this.$splitter.handleSize) + 'px'

    this.style[store.from] = this.$splitter.getPanePosition(this) + 'px'
    if (!isFirstPane) {
      this.style['padding-' + store.from] = this.$splitter.handleSize + 'px'
    }

    // 设置 handle
    this.$handle.style.width = this.$handle.style.height = ''
    this.$handle.style[store.prop] = isFirstPane ? '0' : this.$splitter.handleSize + 'px'
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
