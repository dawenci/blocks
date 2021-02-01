import {
  $colorFontBase,
  $radiusBase,
  $transitionDuration,
} from '../theme/var.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { setRole } from '../core/accessibility.js'
import { dispatchEvent } from '../core/event.js'

// 箭头尺寸
const ARROW_SIZE = 10

// Popup 的原点，13 种取值的原点以及箭头（如果启用箭头）朝向情况如下：
const PopupOrigin = {
  // 中间，无箭头
  Center: 'center',
  // 左上角，箭头朝上
  TopStart: 'top-start',
  // 上方中间，箭头朝上
  TopCenter: 'top-center',
  // 右上角，箭头朝上
  TopEnd: 'top-end',
  // 右上角，箭头朝右
  RightStart: 'right-start',
  // 右方中间，箭头朝右
  RightCenter: 'right-center',
  // 右下角，箭头朝右
  RightEnd: 'right-end',
  // 右下角，箭头朝下
  BottomEnd: 'bottom-end',
  // 下方中间，箭头朝下
  BottomCenter: 'bottom-center',
  // 左下角，箭头朝下
  BottomStart: 'bottom-start',
  // 左下角，箭头朝左
  LeftEnd: 'left-end',
  // 左方中间，箭头朝左
  LeftCenter: 'left-center',
  // 左上角，箭头朝左
  LeftStart: 'left-start',
}

const openGetter = boolGetter('open')
const openSetter = boolSetter('open')
const insetGetter = boolGetter('inset')
const insetSetter = boolSetter('inset')
const autofocusGetter = boolGetter('autofocus')
const autofocusSetter = boolSetter('autofocus')
const capturefocusGetter = boolGetter('capturefocus')
const capturefocusSetter = boolSetter('capturefocus')
const appendToBodyGetter = boolGetter('append-to-body')
const appendToBodySetter = boolSetter('append-to-body')
const autoflipGetter = boolGetter('autoflip')
const autoflipSetter = boolSetter('autoflip')
const restorefocusGetter = boolGetter('restorefocus')
const restorefocusSetter = boolSetter('restorefocus')
const arrowGetter = boolGetter('arrow')
const arrowSetter = boolSetter('arrow')
const originGetter = enumGetter('origin', Object.values(PopupOrigin))
const originSetter = enumSetter('origin', Object.values(PopupOrigin))

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  position: absolute;
  z-index: 10;
  /* TODO
   https://developers.google.com/web/updates/2016/06/css-containment
   */
  contain: none;
  /* 由于非 display none，需要确保 open 之前不可点击 */
  pointer-events: none;
}

:host([open]) {
  pointer-events: auto;
}

:host(:focus) {
  outline: 0 none;
}

#layout {
  position:relative;
  box-sizing: border-box;
  display:inline-block;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: ${$radiusBase};
  transform-origin: center center;
  transition-property: transform, opacity;
  transition-duration: ${$transitionDuration};
  transition-timing-function: cubic-bezier(.645, .045, .355, 1);
}
#arrow {
  overflow: hidden;
  display: block;
  position: absolute;
  /* width, height 留出 5px 投影 */
  width: 24px;
  height: 10px;
  margin: auto;
}
#arrow::after {
  display: block;
  position: absolute;
  top: 5px;
  right: 0;
  bottom: auto;
  left: 0;
  margin: auto;
  content: '';
  width: 10px;
  height: 10px;
  /*border-top: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);*/
  transform: rotate(-45deg);
  background-color: #fff;
}
#arrow::after {
  box-shadow: 0 0 5px rgb(0,0,0,0.06);
}

/* 默认无方向阴影 */
#layout {
  box-shadow: 0 0 5px -4px rgb(0,0,0,0.12),
    0 0 16px 0 rgb(0,0,0,0.08),
    0 0 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout, #layout:focus-within {
  outline: 0 none;
  box-shadow: 0 0 5px -2px rgb(0,0,0,0.16),
    0 0 16px 0 rgb(0,0,0,0.08),
    0 0 28px 8px rgb(0,0,0,0.05);
}
.origin-center-center #arrow {
  display: none;
}

/* 箭头指向上方，阴影向下 */
#layout.origin-top-left.vertical,
#layout.origin-top-center,
#layout.origin-top-right.vertical {
  box-shadow: 0 3px 6px -4px rgb(0,0,0,0.12),
    0 6px 16px 0 rgb(0,0,0,0.08),
    0 9px 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout.origin-top-left.vertical, #layout:focus-within.origin-top-left.vertical,
:host(:focus-within) #layout.origin-top-center, #layout:focus-within.origin-top-center,
:host(:focus-within) #layout.origin-top-right.vertical, #layout:focus-within.origin-top-right.vertical {
  box-shadow: 0 3px 6px -2px rgb(0,0,0,0.16),
    0 6px 16px 0 rgb(0,0,0,0.08),
    0 9px 28px 8px rgb(0,0,0,0.05);
}
.origin-top-left.vertical #arrow {
  top: -9px;
  left: 10px;
}
.origin-top-center #arrow {
  top: -9px;
  left: 0;
  right: 0;
}
.origin-top-right.vertical #arrow {
  top: -9px;
  right: 10px;
}
/* 箭头指向下方，阴影向上 */
#layout.origin-bottom-left,
#layout.origin-bottom-center,
#layout.origin-bottom-right {
  box-shadow: 0 -3px 6px -4px rgb(0,0,0,0.12),
    0 -6px 16px 0 rgb(0,0,0,0.08),
    0 -9px 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout.origin-bottom-right, #layout:focus-within.origin-bottom-right,
:host(:focus-within) #layout.origin-bottom-center, #layout:focus-within.origin-bottom-center,
:host(:focus-within) #layout.origin-bottom-left, #layout:focus-within.origin-bottom-left {
  box-shadow: 0 -3px 6px -2px rgb(0,0,0,0.16),
    0 -6px 16px 0 rgb(0,0,0,0.08),
    0 -9px 28px 8px rgb(0,0,0,0.05);
}
.origin-bottom-left.vertical #arrow {}
/* 未知原因 BUG, 上方多写一行才会生效 */
.origin-bottom-left.vertical #arrow {
  transform: rotate(180deg);
  bottom: -9px;
  left: 10px;
}
.origin-bottom-center #arrow {
  transform: rotate(180deg);
  bottom: -9px;
  left: 0;
  right: 0;
}
.origin-bottom-right.vertical #arrow {
  transform: rotate(180deg);
  bottom: -9px;
  right: 10px;
}
/* 箭头指向左方，阴影向右 */
#layout.origin-center-left,
#layout.origin-top-left.horizontal,
#layout.origin-bottom-left.horizontal {
  box-shadow: 3px 0 6px -4px rgb(0,0,0,0.12),
    6px 0 16px 0 rgb(0,0,0,0.08),
    9px 0 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout.origin-center-left, #layout:focus-within.origin-center-left,
:host(:focus-within) #layout.origin-top-left.horizontal, #layout:focus-within.origin-top-left.horizontal,
:host(:focus-within) #layout.origin-bottom-left.horizontal, #layout:focus-within.origin-bottom-left.horizontal {
  box-shadow: 3px 0 6px -2px rgb(0,0,0,0.16),
    6px 0 16px 0 rgb(0,0,0,0.08),
    9px 0 28px 8px rgb(0,0,0,0.05);
}
.origin-top-left.horizontal #arrow {
  transform: rotate(-90deg);
  top: 10px;
  left: -17px;
}
.origin-center-left #arrow {
  transform: rotate(-90deg);
  top: 0;
  bottom: 0;
  left: -17px;
}
.origin-bottom-left.horizontal #arrow {
  transform: rotate(-90deg);
  bottom: 10px;
  left: -17px;
}
/* 箭头指向右方，阴影向左 */
#layout.origin-center-right,
#layout.origin-top-right.horizontal,
#layout.origin-bottom-right.horizontal {
  box-shadow: -3px 0 6px -4px rgb(0,0,0,0.12),
    -6px 0 16px 0 rgb(0,0,0,0.08),
    -9px 0 28px 8px rgb(0,0,0,0.05);
}
:host(:focus-within) #layout.origin-center-right, #layout:focus-within.origin-center-right,
:host(:focus-within) #layout.origin-top-right.horizontal, #layout:focus-within.origin-top-right.horizontal,
:host(:focus-within) #layout.origin-bottom-right.horizontal, #layout:focus-within.origin-bottom-right.horizontal {
  box-shadow: -3px 0 6px -2px rgb(0,0,0,0.16),
    -6px 0 16px 0 rgb(0,0,0,0.08),
    -9px 0 28px 8px rgb(0,0,0,0.05);
}
.origin-top-right.horizontal #arrow {
  transform: rotate(90deg);
  top: 10px;
  right: -17px;
}
.origin-center-right #arrow {
  transform: rotate(90deg);
  right: -17px;
  top: 0;
  bottom: 0;
}
.origin-bottom-right.horizontal #arrow {
  transform: rotate(90deg);
  bottom: 10px;
  right: -17px;
}

#first, #last, #first:focus, #last:focus {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0 none;
}

:host-context([dark]),
:host([dark]) { color: #fff; }
:host-context([dark]) #layout,
:host-context([dark]) #arrow:after,
:host([dark]) #arrow:after,
:host([dark]) #arrow:after {
  background-color: ${$colorFontBase};
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <i id="arrow"></i>
  <slot></slot>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

function deepActiveElement() {
  let el = document.activeElement
  while (el && el.shadowRoot && el.shadowRoot.activeElement) {
    el = el.shadowRoot.activeElement
  }
  return el
}

class BlocksPopup extends HTMLElement {
  static get observedAttributes() {
    return [
      // Popup 是否展示
      'open',
      // Popup 锚定的布局框，是一个矩形区域
      // Popup 吸附在该矩形的四条边中的某一条的外侧（设置 inset 后在内测）
      // 支持传入一个 `[x, y]` 形式的坐标像素值，这是长宽为 0 的矩形的特例，
      // 支持标准的 `[x1, y1, x2, y2]` 形式的两个坐标点用于左上角、 右下角，
      // 支持传入其他元素的 css selector，表示以该元素的布局矩形为准，
      'anchor',
      // 在锚定的布局框内部渲染 popup（默认吸附在边上，往外面渲染）
      'inset',
      // 是否将节点插入到 document.body 中（通常用于确保 z-index 不会被遮挡）
      'append-to-body',
      // Popup 是否显示箭头
      'arrow',
      // 自动翻转功能，Popup 在 x 或 y 轴上溢出文档时，自动翻转显示
      'autoflip',
      // 打开时是否自动聚焦
      'autofocus',      
      // 失去焦点时，是否恢复获得焦点前的焦点
      'restorefocus',
      // 捕获焦点，tab 键不会将焦点移出 Popup
      'capturefocus',
      // 暗色主题
      'dark',
    ]
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const fragment = template.content.cloneNode(true)
    this.shadowRoot.appendChild(fragment)

    this.$layout = this.shadowRoot.getElementById('layout')
    this.$arrow = this.shadowRoot.getElementById('arrow')

    // 过渡开始时
    this.$layout.ontransitionstart = (ev) => {
      if (ev.target !== this.$layout || ev.propertyName !== 'opacity') return
      this._disableEvents()
    }

    // 过渡进行中时
    this.$layout.ontransitionrun = (ev) => {
      if (ev.target !== this.$layout || ev.propertyName !== 'opacity') return
    }

    // 过渡取消时
    this.$layout.onontransitioncancel = () => {
      if (ev.target !== this.$layout || ev.propertyName !== 'opacity') return
    }

    // 过渡结束时
    this.$layout.ontransitionend = (ev) => {
      if (ev.target !== this.$layout || ev.propertyName !== 'opacity') return
      this._enableEvents()

      if (this.open) {
        if (this.autofocus) this._focus()
        dispatchEvent(this, 'open')
        // 动画过程可能锚定点移动，动画结束后，更新下位置
        this.updatePosition()
      }
      else {
        this._blur()
        this.$layout.style.display = 'none'
        dispatchEvent(this, 'close')
      }
    }

    if (this.capturefocus) {
      this._captureFocus()
    }
  }

  get open() {
    return openGetter(this)
  }

  // 设置 open 属性为 null 或 false，表示关闭，其他任意指表示打开
  set open(value) {
    openSetter(this, value)
  }

  get origin() {
    return originGetter(this)
  }

  set origin(value) {
    originSetter(this, value)
  }

  get inset() {
    return insetGetter(this)
  }

  set inset(value) {
    insetSetter(this, value)
  }

  // 吸附到的元素 selector，设置了该属性且对应的元素存在，则忽略 x、y 属性
  get anchor() {
    return this.getAttribute('anchor')
  }

  set anchor(value) {
    this.setAttribute('anchor', value)
  }

  get appendToBody() {
    return appendToBodyGetter(this)
  }

  set appendToBody(value) {
    appendToBodySetter(value)
  }

  get arrow() {
    return arrowGetter(this)
  }

  set arrow(value) {
    arrowSetter(this, value)
  }

  get autofocus() {
    return autofocusGetter(this)
  }

  set autofocus(value) {
    autofocusSetter(this, value)
  }

  get capturefocus() {
    return capturefocusGetter(this)
  }

  set capturefocus(value) {
    capturefocusSetter(this, value)
  }

  get autoflip() {
    return autoflipGetter(this)
  }

  set autoflip(value) {
    autoflipSetter(this, value)
  }

  get restorefocus() {
    return restorefocusGetter(this)
  }

  set restorefocus(value) {
    restorefocusSetter(this, value)
  }

  // Popup 相对一个矩形框进行布局，可以吸附在框的四条边，也可以吸附在框的中心点
  // layoutFrame 返回这个矩形框的四条边的相对于 viewport 的定位数值
  get layoutFrame() {
    let x1
    let x2
    let y1
    let y2
    let layoutAnchor
    const anchor = this.getAttribute('anchor')?.trim?.()
    if (!anchor) {
      layoutAnchor = getOffsetParent(this)
    }
    // [x1, y1, x2, y2]
    else if (/\[\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\]/.test(anchor)) {
      [x1, y1, x2, y2] = JSON.parse(anchor)
    }
    // [x1, y1]
    else if (/\[\s*\d+\s*,\s*\d+\s*\]/.test(anchor)) {
      [x1, y1] = JSON.parse(anchor)
      x2 = x1
      y2 = y1
    }
    else {
      layoutAnchor = document.querySelector(anchor)
    }

    if (layoutAnchor) {
      const rect = layoutAnchor.getBoundingClientRect()
      y1 = Math.floor(rect.top)
      x1 = Math.floor(rect.left)
      y2 = y1 + rect.height
      x2 = x1 + rect.width
    }
    else {
      const { top, left } = getOffsetParent(this)?.getBoundingClientRect?.()
      x1 += left
      x2 += left
      y1 += top
      y2 += top
    }

    return { x1, y1, x2, y2 }
  }  

  updatePosition() {
    if (!this.open) return

    const popup = this.$layout
    const popupWidth = popup.offsetWidth
    const popupHeight = popup.offsetHeight

    // 定位的相对元素
    const layoutParent = getOffsetParent(this)
    if (!layoutParent) return

    const { scrollTop, scrollLeft } = layoutParent
    const { scrollWidth: layoutWidth, scrollHeight: layoutHeight } = layoutParent
    const { top: layoutOffsetTop, left: layoutOffsetLeft } = layoutParent.getBoundingClientRect()

    // 锚定位置点
    // x1 最左取值，x2 最右取值
    // y1 最上取值，y2 最下取值
    const { x1, y1, x2, y2 } = this.layoutFrame

    let top
    let left
    let shadowX
    let shadowY
    let originX
    let originY

    const verticalFlip = () => {
      shadowY = ({ top: 'bottom', bottom: 'top', center: 'center' })[shadowY]
      originY = ({ top: 'bottom', bottom: 'top', center: 'center' })[originY]
    }

    const horizontalFlip = () => {
      shadowX = ({ left: 'right', right: 'left' })[shadowX]
      originX = ({ left: 'right', right: 'left' })[originX]
    }

    const arrowSize = this.arrow ? ARROW_SIZE : 0

    // 配置 Popup 定位起始边（如果启用了箭头，也是箭头所在边）
    // 1. 起始边为上边，往下方展开 Popup
    // 吸附在 layoutFrame 的下边，如果启用 inset，则吸附在 layoutFrame 的上边
    if (this.origin.startsWith('top')) {      
      top = (this.inset ? y1 : y2) + arrowSize
      originY = 'top'
      shadowY = 'bottom'
      // 如果 popup 溢出视口，则检查翻转吸附在 y 的上方是否更好，如果是，则翻转
      if (this.autoflip && (top + popupHeight > layoutHeight)) {
        const flipTop = (this.inset ? y2 : y1) - arrowSize - popupHeight
        if (flipTop > 0) {
          top = flipTop
          verticalFlip()
        }
      }
    }

    // 2. 起始边为右边，往左方展开 Popup
    // 吸附在 layoutFrame 的左边，如果启用 inset 则吸附在 layoutFrame 的右边
    else if (this.origin.startsWith('right')) {
      left = (this.inset ? x1 : x2) - arrowSize - popupWidth
      originX = 'right'
      shadowX = 'left'
      if (this.autoflip && (left < 0)) {
        const flipLeft = (this.inset ? x1 : x2) + arrowSize
        if (flipLeft + popupWidth < layoutWidth) {
          left = flipLeft
          horizontalFlip()
        }
      }
    }

    // 3. 起始边为下边，往上方展开
    // 吸附在 layoutFrame 的上边，如果启用 inset 则吸附在 layoutFrame 的下边
    else if (this.origin.startsWith('bottom')) {
      top = (this.inset ? y2 : y1) - arrowSize - popupHeight
      originY = 'bottom'
      shadowY = 'top'
      // 如果 popup 溢出视口，则检查翻转吸附在目标的下边是否更好，如果是，则翻转
      if (this.autoflip && (top < 0)) {
        const flipTop = (this.inset ? y1 : y2) + arrowSize
        if (flipTop + popupHeight < layoutHeight) {
          top = flipTop
          verticalFlip()
        }
      }
    }

    // 4. 起始边为左边，往右方展开 Popup
    // 吸附在 layoutFrame 的右边，如果启用 inset 则吸附在 layoutFrame 的左边
    else if (this.origin.startsWith('left')) {
      left = (this.inset ? x1 : x2) + arrowSize
      originX = 'left'
      shadowX = 'right'
      if (this.autoflip && (left + popupWidth > layoutWidth)) {
        const flipLeft = (this.inset ? x2 : x1) - arrowSize - popupWidth
        if (flipLeft > 0) {
          left = flipLeft
          horizontalFlip()
        }
      }
    }

    // 5. 无起始边，从中心往外展开 Popup
    else {
      top = (y1 + (y2 - y1) / 2) - (popupHeight / 2)
      left = (x1 + (x2 - x1) / 2) - (popupWidth / 2)
      originX = 'center'
      originY = 'center'
      shadowX = 'center'
      shadowY = 'center'
    }

    // 配置 Popup 在起始边上的原点位置（如果启用了箭头，也是箭头在起始边上的位置）
    if (this._isVertical()) {
      if (this.origin.endsWith('start')) {
        // 与起始边左侧对齐
        left = x1
        originX = 'left'
        shadowX = 'right'
        // 如果与 popup 的右侧溢出视口，则检查向左侧渲染是否更好，是则翻转成右对齐
        if (this.autoflip && (x1 + popupWidth > layoutWidth) && (x2 - popupWidth > 0)) {
          left = x2 - popupWidth
          horizontalFlip()
        }
      }

      else if (this.origin.endsWith('end')) {
        // 与起始边右侧对齐
        left = x2 - popupWidth
        originX = 'right'
        shadowX = 'left'
        // 如果与 popup 的左侧溢出视口，则检查向右侧渲染是否更好，是则翻转
        if (this.autoflip && (left < 0) && (x1 + popupWidth < layoutWidth)) {
          left = x1
          horizontalFlip()
        }
      }

      else if (this.origin.endsWith('center')) {
        // 与起始边中对齐，不翻转
        left = (x1 + (x2 - x1) / 2) - (popupWidth / 2)
        originX = 'center'
        shadowX = 'center'
      }
    }

    else if (this._isHorizontal()) {
      if (this.origin.endsWith('start')) {
        // 默认与起始边顶部对齐
        top = y1
        originY = 'top'
        shadowY = 'bottom'
        // 如果与 popup 的下方溢出视口，则检查向上渲染是否更好，是则翻转
        if (this.autoflip && (y1 + popupHeight > layoutHeight) && (y2 - popupHeight > 0)) {
          top = y2 - popupHeight
          verticalFlip()
        }
      }

      else if (this.origin.endsWith('end')) {
        // 默认与起始边底部对齐
        top = y2 - popupHeight
        originY = 'bottom'
        shadowY = 'top'
        // 如果与 popup 的上方溢出视口，则检查向下渲染是否更好，是则翻转
        if (this.autoflip && (top < 0) && (y1 + popupHeight < layoutHeight)) {
          top = y1 + popupHeight
          verticalFlip()
        }
      }

      else if (this.origin.endsWith('center')) {
        // 与起始边中对齐，不翻转
        top = (y1 + (y2 - y1) / 2) - (popupHeight / 2)
        originY = 'center'
        shadowY = 'center'
      }
    }

    this.style.top = `${top + scrollTop - layoutOffsetTop}px`
    this.style.left = `${left + scrollLeft - layoutOffsetLeft}px`
    this._setOrigin(originY, originX)
  }

  initAnchorEvent() {
    if (this._refreshPosition) return
    this._refreshPosition = () => this.open && this.anchor && this.updatePosition()
    // 使用捕获的方式，以保证内部元素滚动也能触发
    window.addEventListener('scroll', this._refreshPosition, true)
    window.addEventListener('touchstart', this._refreshPosition)
    window.addEventListener('click', this._refreshPosition)
  }

  destroyAnchorEvent() {
    this._refreshPosition = null
    window.removeEventListener('scroll', this._refreshPosition, true)
    window.removeEventListener('touchstart', this._refreshPosition)
    window.removeEventListener('click', this._refreshPosition)
  }

  connectedCallback() {
    setRole(this, 'popup')

    // 将 tabindex 设置在 host 上，
    // 因为 tabindex 在 popup 上的话，鼠标点击 slot 里面的内容时会反复 blur
    this.setAttribute('tabindex', '0')

    if (this.appendToBody && this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    // 设置初始样式，确保动画生效
    if (!this.open) {
      this.$layout.style.display = 'none'
      this.$layout.style.opacity = '0'
      this.$layout.style.transform = 'scale(0)'
    }
    else {
      this.updatePosition()
    }

    this.initAnchorEvent()
  }

  disconnectedCallback() {
    this.destroyAnchorEvent()
  }

  // adoptedCallback() {
  // }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'open': {
        this._updateVisible()
        break
      }

      case 'arrow': {
        this._updateArrow()
        break
      }
 
      case 'append-to-body': {
        if (this.appendToBody && this.parentElement !== document.body) {
          document.body.appendChild(this)
        }
        this.updatePosition()
        break
      }

      case 'capturefocus': {
        if (this.capturefocus) {
          this._captureFocus()
        }
        else {
          this._stopCaptureFocus()
        }
        break
      }

      default: {
        this.updatePosition()
        break
      }
    }
  }

  // 强制捕获焦点，避免 Tab 键导致焦点跑出去 popup 外面
  _captureFocus() {
    this._firstFocusable = this.$layout.querySelector('#first') || this.$layout.insertBefore(document.createElement('button'), this.$layout.firstChild)
    this._lastFocusable = this.$layout.querySelector('#last') || this.$layout.appendChild(document.createElement('button'))
    this._firstFocusable.id = 'first'
    this._lastFocusable.id = 'last'
    this._firstFocusable.onkeydown = e => {
      if (e.key === 'Tab' && e.shiftKey) {
        this._lastFocusable.focus()
      }
    }
    this._lastFocusable.onkeydown = e => {
      if (e.key === 'Tab' && !e.shiftKey) {
        this._firstFocusable.focus()
      }
    }
  }

  // 停止强制捕获焦点
  _stopCaptureFocus() {
    if (this._firstFocusable && this._firstFocusable.parentElement) {
      this.$layout.removeChild(this._firstFocusable)
    }
    if (this._firstFocusable && this._lastFocusable.parentElement) {
      this.$layout.removeChild(this._lastFocusable)
    }
  }

  // 执行过渡前的准备工作，确保动画正常
  _prepareForAnimate() {
    this.$layout.style.display = ''
    this.$layout.offsetHeight
  }

  _animateOpen() {
    // 强制执行动画
    this.$layout.offsetHeight
    this.$layout.style.opacity = ''
    this.$layout.style.transform = ''
  }

  _animateClose() {
    // 强制执行动画
    this.$layout.offsetHeight
    this.$layout.style.opacity = '0'
    this.$layout.style.transform = 'scale(0)'
  }

  _updateVisible() {
    this._updateClass()
    this._updateArrow()
    this._prepareForAnimate()
    this.updatePosition()
    if (this.open) {
      this._animateOpen()
    }
    else {
      this._animateClose()
    }
  }

  _isHorizontal() {
    return this.origin.startsWith('left') || this.origin.startsWith('right')
  }

  _isVertical() {
    return this.origin.startsWith('top') || this.origin.startsWith('bottom')
  }

  _updateClass() {
    if (this._isHorizontal()) {
      this.$layout.classList.add('horizontal')
      this.$layout.classList.remove('vertical')
    }
    else if (this._isVertical()) {
      this.$layout.classList.remove('horizontal')
      this.$layout.classList.add('vertical')
    }
    else {
      this.$layout.classList.remove('horizontal')
      this.$layout.classList.remove('vertical')
    }
  }

  _updateArrow() {
    if (this.arrow) {
      this.$arrow.style.display = ''
    }
    else {
      this.$arrow.style.display = 'none'
    }
  }

  _focus() {
    if (this.restorefocus && !this._prevFocus) {
      this._prevFocus = document.activeElement
    }
    this.focus()
  }

  _blur() {
    this.blur()
    if (this._prevFocus) {
      if (this.restorefocus && typeof this._prevFocus.focus) {
        this._prevFocus.focus()
      }
      this._prevFocus = undefined
    }
  }

  // 设置原点 class
  _setOriginClass(value) {
    [...this.$layout.classList.values()].forEach(className => {
      if (className !== value && className.startsWith('origin-')) {
        this.$layout.classList.remove(className)
      }
    })
    this.$layout.classList.add(value)
  }

  // 设置 css 变换原点
  _setOrigin(y, x) {
    this._setOriginClass(`origin-${y}-${x}`)
    this.$layout.style.transformOrigin = `${y} ${x}`
  }

  // 启用鼠标交互
  _enableEvents() {
    this.$layout.style.pointerEvents = ''
  }

  // 禁用鼠标交互
  _disableEvents() {
    this.$layout.style.pointerEvents = 'none'
  }
}

if (!customElements.get('blocks-popup')) {
  customElements.define('blocks-popup', BlocksPopup)
}

// 等腰直角三角形，根据高求腰（矩形的边）
function getArrowRectSize(height) {
  return Math.round(height * Math.SQRT2)
}

function getOffsetParent(popup) {
  let el = popup
  while (el) {
    if (el.offsetParent) return el.offsetParent
    el = el.parentElement
  }
  return null
}
