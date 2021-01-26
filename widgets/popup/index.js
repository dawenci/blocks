import {
  $radiusBase,
  $transitionDuration,
} from '../theme/var.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { setRole } from '../core/accessibility.js'
import { dispatchEvent } from '../core/event.js'

// 箭头尺寸
const ARROW_SIZE = 6

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

#popup {
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

:host([open]) #popup {
  /* 非 focus 时，shadow 无方向 */
  box-shadow: 0px 0 3px rgba(0, 0, 0, 0.2);
}


/* 焦点状态显示阴影 */
:host(:focus-within) #popup,
#popup:focus-within {
  outline: 0 none;
  box-shadow: 0px 0 3px rgba(0, 0, 0, 0.15), 0px 0 5px rgba(0, 0, 0, 0.15);
}
:host(:focus-within) #popup.origin-bottom-right,
#popup:focus-within.origin-bottom-right {
  box-shadow: -1px -1px 3px -1px rgba(0, 0, 0, 0.1), -2px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.15);
}
:host(:focus-within) #popup.origin-bottom-left,
#popup:focus-within.origin-bottom-left {
  box-shadow: 1px -1px 3px -1px rgba(0, 0, 0, 0.1), 2px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.15);
}
:host(:focus-within) #popup.origin-top-right,
#popup:focus-within.origin-top-right {
  box-shadow: -1px 1px 3px -1px rgba(0, 0, 0, 0.1), -2px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.15);
}
:host(:focus-within) #popup.origin-top-left,
#popup:focus-within.origin-top-left {
  box-shadow: 1px 1px 3px -1px rgba(0, 0, 0, 0.1), 2px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.15);
}
:host(:focus-within) #popup.origin-bottom-center,
#popup:focus-within.origin-bottom-center {
  box-shadow: 0px -1px 3px -1px rgba(0, 0, 0, 0.1), 0px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.15);
}
:host(:focus-within) #popup.origin-top-center,
#popup:focus-within.origin-top-center {
  box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.15);
}
:host(:focus-within) #popup.origin-center-left,
#popup:focus-within.origin-center-left {
  box-shadow: 1px 0px 3px -1px rgba(0, 0, 0, 0.1), 2px 0px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.15);
}
:host(:focus-within) #popup.origin-center-right,
#popup:focus-within.origin-center-right {
  box-shadow: -1px 0px 3px -1px rgba(0, 0, 0, 0.1), -2px 0px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.15);
}

#arrow {
  display: block;
  position: absolute;
  z-index: -1;
  width: ${getArrowRectSize(ARROW_SIZE)}px;
  height: ${getArrowRectSize(ARROW_SIZE)}px;
  background-color: inherit;
  transform: rotate(-45deg);
  margin: auto;
}

/* 阴影在四周 */
.origin-center-center #arrow {
  display: none;
}

/* 阴影在左上方 */
/* 垂直模式，箭头指向下方，位置靠右 */
.origin-bottom-right.vertical #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  bottom: -5px;
  right: 10px;
}
/* 水平模式，箭头指向右方，位置靠下 */
.origin-bottom-right.horizontal #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  bottom: 10px;
  right: -5px;
}

/* 阴影在右上方 */
/* 垂直模式，箭头指向下方，位置靠左 */
.origin-bottom-left.vertical #arrow {}
/* 未知原因 BUG, 上方多写一行才会生效 */
.origin-bottom-left.vertical #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  bottom: -5px;
  left: 10px;
}
/* 水平模式，箭头指向左方，位置靠下 */
.origin-bottom-left.horizontal #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  bottom: 10px;
  left: -5px;
}

/* 阴影在右下方 */
/* 垂直模式，箭头指向上方，位置靠左 */
.origin-top-left.vertical #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  top: -5px;
  left: 10px;
}
/* 水平模式，箭头指向左方，位置靠上 */
.origin-top-left.horizontal #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  top: 10px;
  left: -5px;
}


/* 阴影在左下方 */
/* 垂直模式，箭头指向上方，位置靠右 */
.origin-top-right.vertical #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  top: -5px;
  right: 10px;
}
/* 水平模式，箭头指向右方，位置靠上 */
.origin-top-right.horizontal #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  top: 10px;
  right: -5px;
}

/* 阴影在正上方 */
/* 箭头指向下方，位置居中 */
.origin-bottom-center.vertical #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  bottom: -5px;
  left: 0;
  right: 0;
}

/* 阴影在正右方 */
/* 箭头指向左方，位置居中 */
.origin-center-left.horizontal #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  top: 0;
  bottom: 0;
  left: -5px;
}

/* 阴影在正下方 */
/* 箭头指向上方，位置居中 */
.origin-top-center.vertical #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  top: -5px;
  left: 0;
  right: 0;
}

/* 阴影在正左方 */
/* 箭头指向右方，位置居中 */
.origin-center-right.horizontal #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  right: -5px;
  top: 0;
  bottom: 0;
}

</style>`

const TEMPLATE_HTML = `
<div id="popup">
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
      // 打开时是否自动聚焦
      'autofocus',
      // 自动翻转功能，Popup 在 x 或 y 轴上溢出文档时，自动翻转显示
      'autoflip',
      // 失去焦点时，是否恢复获得焦点前的焦点
      'restorefocus',
    ]
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const fragment = template.content.cloneNode(true)
    this.shadowRoot.appendChild(fragment)

    this._popup = this.shadowRoot.getElementById('popup')
    this._popupArrow = this.shadowRoot.getElementById('arrow')

    // 过渡开始时
    this._popup.ontransitionstart = (ev) => {
      if (ev.target !== this._popup || ev.propertyName !== 'opacity') return
      this._disableEvents()
    }

    // 过渡进行中时
    this._popup.ontransitionrun = (ev) => {
      if (ev.target !== this._popup || ev.propertyName !== 'opacity') return
    }

    // 过渡取消时
    this._popup.onontransitioncancel = () => {
      if (ev.target !== this._popup || ev.propertyName !== 'opacity') return
    }

    // 过渡结束时
    this._popup.ontransitionend = (ev) => {
      if (ev.target !== this._popup || ev.propertyName !== 'opacity') return
      this._enableEvents()

      if (this.open) {
        if (this.autofocus) this._focus()
        dispatchEvent(this, 'open')
        // 动画过程可能锚定点移动，动画结束后，更新下位置
        this.updatePosition()
      }
      else {
        this._blur()
        this._popup.style.display = 'none'
        dispatchEvent(this, 'close')
      }
    }

    // 避免 Tab 键导致焦点跑出去 popup 外面
    this.addEventListener('keydown', e => {
      // 让 Tab 键只能在 popup 内部的控件之间切换
      if (e.key === 'Tab') {
        if (!this.contains(document.activeElement) || document.activeElement === this) {
          this.focus()
        }
      }
      if (e.key === 'Escape') {
        this.open = false
      }
    })    
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

    const popup = this._popup
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
    this.setAttribute('tabindex', '-1')

    if (this.appendToBody && this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    // 设置初始样式，确保动画生效
    if (!this.open) {
      this._popup.style.display = 'none'
      this._popup.style.opacity = '0'
      this._popup.style.transform = 'scale(0)'
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
 
      case 'append-to-body': {
        if (this.appendToBody && this.parentElement !== document.body) {
          document.body.appendChild(this)
        }
        this.updatePosition()
        break
      }

      default: {
        this.updatePosition()
        break
      }
    }
  }

  // 执行过渡前的准备工作，确保动画正常
  _prepareForAnimate() {
    this._popup.style.display = ''
    this._popup.offsetHeight
  }

  _animateOpen() {
    // 强制执行动画
    this._popup.offsetHeight
    this._popup.style.opacity = ''
    this._popup.style.transform = ''
  }

  _animateClose() {
    // 强制执行动画
    this._popup.offsetHeight
    this._popup.style.opacity = '0'
    this._popup.style.transform = 'scale(0)'
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
      this._popup.classList.add('horizontal')
      this._popup.classList.remove('vertical')
    }
    else if (this._isVertical()) {
      this._popup.classList.remove('horizontal')
      this._popup.classList.add('vertical')
    }
    else {
      this._popup.classList.remove('horizontal')
      this._popup.classList.remove('vertical')
    }
  }

  _updateArrow() {
    if (this.arrow) {
      this._popupArrow.style.display = ''
    }
    else {
      this._popupArrow.style.display = 'none'
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
    [...this._popup.classList.values()].forEach(className => {
      if (className !== value && className.startsWith('origin-')) {
        this._popup.classList.remove(className)
      }
    })
    this._popup.classList.add(value)
  }

  // 设置 css 变换原点
  _setOrigin(y, x) {
    this._setOriginClass(`origin-${y}-${x}`)
    this._popup.style.transformOrigin = `${y} ${x}`
  }

  // 启用鼠标交互
  _enableEvents() {
    this._popup.style.pointerEvents = ''
  }

  // 禁用鼠标交互
  _disableEvents() {
    this._popup.style.pointerEvents = 'none'
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
