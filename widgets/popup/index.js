import '../button/index.js'
import {
  $fontFamily,
  $radiusBase,
} from '../theme/var.js'


// 等腰直角三角形，根据高求腰（矩形的边）
function getArrowRectSize(height) {
  return Math.round(height * Math.SQRT2)
}

const ARROW_SIZE = 6

const AnchorOrigin = {
  Center: 'center',
  TopStart: 'top-start',
  TopCenter: 'top-center',
  TopEnd: 'top-end',
  RightStart: 'right-start',
  RightCenter: 'right-center',
  RightEnd: 'right-end',
  BottomEnd: 'bottom-end',
  BottomCenter: 'bottom-center',
  BottomStart: 'bottom-start',
  LeftEnd: 'left-end',
  LeftCenter: 'left-center',
  LeftStart: 'left-start',
}

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  position: absolute;
  z-index: 10001;
  top: 0;
  left: 0;
  right: auto;
  bottom: auto;
  margin: auto;
  /* TODO
   https://developers.google.com/web/updates/2016/06/css-containment
   */
  contain: none;

  /* 关闭状态 */
  pointer-events: none;
}

:host([open]) {
  pointer-events: auto;
}

/* 焦点状态显示阴影 */
:host(:focus) {
  outline: 0 none;
}

#popup {
  position:relative;
  box-sizing: border-box;
  display:inline-block;
  background-color: #fff;
  border-radius: ${$radiusBase};
  transform-origin: center center;
  transition-property: transform, opacity;
  transition-duration: .16s;
  transition-timing-function: cubic-bezier(.645, .045, .355, 1);
  opacity: 0;
  transform: scale(0);
}

:host([open]) #popup {
  opacity: 1;
  transform: scale(1);
  /* 非 focus 时，shadow 无方向 */
  box-shadow: 0px 0 3px rgba(0, 0, 0, 0.1);
}


/* 焦点状态显示阴影 */
:host(:focus-within) #popup,
#popup:focus-within {
  outline: 0 none;
  box-shadow: 0px 0 3px rgba(0, 0, 0, 0.2), 0px 0 5px rgba(0, 0, 0, 0.1);
}
:host(:focus-within) #popup.origin-bottom-right,
#popup:focus-within.origin-bottom-right {
  box-shadow: -1px -1px 3px -1px rgba(0, 0, 0, 0.1), -2px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.origin-bottom-left,
#popup:focus-within.origin-bottom-left {
  box-shadow: 1px -1px 3px -1px rgba(0, 0, 0, 0.1), 2px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.origin-top-right,
#popup:focus-within.origin-top-right {
  box-shadow: -1px 1px 3px -1px rgba(0, 0, 0, 0.1), -2px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.origin-top-left,
#popup:focus-within.origin-top-left {
  box-shadow: 1px 1px 3px -1px rgba(0, 0, 0, 0.1), 2px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.origin-bottom-center,
#popup:focus-within.origin-bottom-center {
  box-shadow: 0px -1px 3px -1px rgba(0, 0, 0, 0.1), 0px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.origin-top-center,
#popup:focus-within.origin-top-center {
  box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.origin-center-left,
#popup:focus-within.origin-center-left {
  box-shadow: 1px 0px 3px -1px rgba(0, 0, 0, 0.1), 2px 0px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.origin-center-right,
#popup:focus-within.origin-center-right {
  box-shadow: -1px 0px 3px -1px rgba(0, 0, 0, 0.1), -2px 0px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
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
<div id="popup" role="popup" tabindex="-1">
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
      'open',
      'x',
      'y',
      'anchor',
      'arrow',
      'flip',
      'restorefocus',
    ]
  }

  constructor() {
    super()

    this.attachShadow({
      mode: 'open',
      // 代理焦点，
      // 1. 点击 shadow DOM 内某个不可聚焦的区域，则第一个可聚焦区域将成为焦点
      // 2. 当 shadow DOM 内的节点获得焦点时，除了聚焦的元素外，:focus 还会应用到宿主
      // 3. 自己的 slot 中的元素聚焦，宿主不会获得焦点，但是 :focus-within 生效
      delegatesFocus: true
    })

    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.popup = this.shadowRoot.getElementById('popup')
    this.popupArrow = this.shadowRoot.getElementById('arrow')

    // TODO，避免 Tab 键导致焦点跑出去 popup 外面
    this.popup.onkeydown = (e) => {
      if (e.key !== 'Tab') return
    }

    // 过渡开始时
    this.popup.ontransitionstart = (ev) => {
      if (ev.propertyName !== 'opacity') {
        return
      }
      this._disableEvents()
    }

    // 过渡进行中时
    this.popup.ontransitionrun = (ev) => {
      if (ev.propertyName !== 'opacity') {
        return
      }
    }

    // 过渡取消时
    this.popup.onontransitioncancel = () => {}

    // 过渡结束时
    this.popup.ontransitionend = (ev) => {
      if (ev.propertyName !== 'opacity') {
        return
      }
      this._enableEvents()
      if (this.open) {
        this._focus()
        this.dispatchEvent(new CustomEvent('open'))
        // 动画过程可能锚定点移动，动画结束后，更新下位置
        this.updatePosition()
      }
      else {
        this._blur()
        this.popup.style.display = 'none'
        this.dispatchEvent(new CustomEvent('close'))
      }
    }
  }

  get open() {  
    return this._getBool('open')
  }

  // 设置 open 属性为 null 或 false，表示关闭，其他任意指表示打开
  set open(value) {
    this._setBool('open', value)
  }

  // Popup 锚定的原点，13 种取值的锚定起点以及箭头（如果启用箭头）朝向情况如下：
  // 'center'        // 中间，无箭头
  // 'top-start'     // 左上角，箭头朝上
  // 'top-center'    // 上方中间，箭头朝上
  // 'top-end'       // 右上角，箭头朝上
  // 'right-start'   // 右上角，箭头朝右
  // 'right-center'  // 右方中间，箭头朝右
  // 'right-end'     // 右下角，箭头朝右
  // 'bottom-end'    // 右下角，箭头朝下
  // 'bottom-center' // 下方中间，箭头朝下
  // 'bottom-start'  // 左下角，箭头朝下
  // 'left-end'      // 左下角，箭头朝左
  // 'left-center'   // 左方中间，箭头朝左
  // 'left-start'    // 左上角，箭头朝左
  get origin() {
    return this.getAttribute('origin') || AnchorOrigin.Center
  }

  set origin(value) {
    this.setAttribute('origin', value)
  }

  // 吸附到的元素 selector，设置了该属性且对应的元素存在，则忽略 x、y 属性
  get anchor() {
    return this.getAttribute('anchor')
  }

  set anchor(value) {
    this.setAttribute('anchor', value)
  }

  // Popup 的锚定原点位于页面上的 position x 轴座标（或座标范围）
  // 传入的如果是个数字，则代表座标点，传入的是个数组，则代表是个座标范围
  get x() {
    if (this.anchor) {
      const anchorElement = document.querySelector(this.anchor)
      if (anchorElement) {
        const rect = anchorElement.getBoundingClientRect()
        return [rect.x, rect.x + rect.width ]
      }
    }

    const attrValue = this.getAttribute('x')
    if (attrValue != null) {
      if (/\[\s*\d+(\s*\,\s*\d+)\s*\]/.test(attrValue.trim())) {
        return JSON.parse(attrValue)
      }
      if (/\d+/.test(attrValue.trim())) {
        return parseInt(attrValue,10)
      }
    }
    return document.body.scrollWidth / 2
  }

  set x(n) {
    if (Array.isArray(n)) {
      this.setAttribute('x', JSON.stringify(n))
    }
    else {
      this.setAttribute('x', n)
    }
  }

  // Popup 的锚定原点位于页面上的 position y 轴
  get y() {
    if (this.anchor) {
      const anchorElement = document.querySelector(this.anchor)
      if (anchorElement) {
        const rect = anchorElement.getBoundingClientRect()
        return [rect.y, rect.y + rect.height ]
      }
    }

    const attrValue = this.getAttribute('y')
    if (attrValue != null) {
      if (/\[\s*\d+(\s*\,\s*\d+)\s*\]/.test(attrValue.trim())) {
        return JSON.parse(attrValue)
      }
      if (/\d+/.test(attrValue.trim())) {
        return parseInt(attrValue,10)
      }
    }
    return document.body.scrollHeight / 2
  }

  set y(n) {
    if (Array.isArray(n)) {
      this.setAttribute('y', JSON.stringify(n))
    }
    else {
      this.setAttribute('y', n)
    }
  }

  get arrow() {
    return this._getBool('arrow')
  }

  set arrow(value) {
    this._setBool('arrow', value)
  }

  get autoflip() {
    return this._getBool('autoflip')
  }

  set autoflip(value) {
    this._setBool('autoflip', value)
  }

  get restorefocus() {
    return this._getBool('restorefocus')
  }

  set restorefocus(value) {
    this._setBool('restorefocus', value)
  }

  connectedCallback() {
    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    this._upgradeProperty('open')
    this._upgradeProperty('x')
    this._upgradeProperty('y')
    this._upgradeProperty('origin')
    this._upgradeProperty('arrow')

    // 让 Tab 键只能在 popup 内部的控件之间切换
    this._onKeydown = (e) => {
      if (e.key !== 'Tab') return
      requestAnimationFrame(() => {
        if (!this.contains(deepActiveElement())) {
          this.popup.focus()
        }
      })
    }
    this.shadowRoot.addEventListener('keydown', this._onKeydown)
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('keydown', this._onKeydown)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'open': {
        this._updateVisible()
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
    this.popup.style.display = ''
  }  

  _animateOpen() {
    // 强制执行动画
    this.popup.offsetHeight
    this.popup.style.opacity = ''
    this.popup.style.transform = ''
  }

  _animateClose() {
    // 强制执行动画
    this.popup.offsetHeight
    this.popup.style.opacity = '0'
    this.popup.style.transform = 'scale(0)' 
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
      this.popup.classList.add('horizontal')
      this.popup.classList.remove('vertical')
    }
    else if (this._isVertical()) {
      this.popup.classList.remove('horizontal')
      this.popup.classList.add('vertical')
    }
    else {
      this.popup.classList.remove('horizontal')
      this.popup.classList.remove('vertical')
    }
  }

  _updateArrow() {
    if (this.arrow) {
      this.popupArrow.style.display = ''
    }
    else {
      this.popupArrow.style.display = 'none'
    }
  }

  updatePosition() {
    if (!this.open) return

    const popup = this.popup
    const popupWidth = popup.offsetWidth
    const popupHeight = popup.offsetHeight
    
    const containerWidth = document.body.scrollWidth
    const containerHeight = document.body.scrollHeight
    const scrollTop = document.documentElement.scrollTop + document.body.scrollTop
    const scrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft
    const arrowSize = this.arrow ? ARROW_SIZE : 0    

    // 锚定位置点
    // x1 最左取值，x2 最右取值
    // y1 最上取值，y2 最下取值
    const [x1, x2] = Array.isArray(this.x) ? this.x : [this.x, this.x]
    const [y1, y2] = Array.isArray(this.y) ? this.y : [this.y, this.y]

    let top
    let left
    let shadowX
    let shadowY
    let originX
    let originY

    const verticalFlip = () => {
      shadowY = ({ Top: 'bottom', Bottom: 'top', Center: 'center' })[shadowY]
      originY = ({ Top: 'bottom', Bottom: 'top', Center: 'center' })[originY]
    }

    const horizontalFlip = () => {
      shadowX = ({ Left: 'right', Right: 'left' })[shadowX]
      originX = ({ Left: 'right', Right: 'left' })[originX]
    }

    // 配置 Popup 定位起始边（如果启用了箭头，也是箭头所在边）
    // 1. 起始边为上边，往下方展开 Popup
    if (this.origin.startsWith('top')) {
      top = y2 + arrowSize
      originY = 'top'
      shadowY = 'bottom'
      // 如果 popup 溢出视口，则检查翻转吸附在 y 的上方是否更好，如果是，则翻转
      if (this.autoflip && (top + popupHeight > containerHeight)) {
        const flipTop = y1 - arrowSize - popupHeight
        if (flipTop > 0) {
          top = flipTop
          verticalFlip()
        }
      }
    }
    // 2. 起始边为右边，往左方展开 Popup
    else if (this.origin.startsWith('right')) {
      left = x1 - arrowSize - popupWidth
      originX = 'right'
      shadowX = 'left'
      if (this.autoflip && (left < 0)) {
        const flipLeft = x1 + arrowSize
        if (flipLeft + popupWidth < containerWidth) {
          left = flipLeft
          horizontalFlip()
        }
      }
    }    
    // 3. 起始边为下边，往上方展开
    else if (this.origin.startsWith('bottom')) {
      top = y1 - arrowSize - popupHeight
      originY = 'bottom'
      shadowY = 'top'
      // 如果 popup 溢出视口，则检查翻转吸附在目标的下边是否更好，如果是，则翻转
      if (this.autoflip && (top < 0)) {
        const flipTop = y1 + arrowSize
        if (flipTop + popupHeight < containerHeight) {
          top = flipTop
          verticalFlip()
        }
      }
    }
    // 4. 起始边为左边，往右方展开 Popup
    else if (this.origin.startsWith('left')) {
      left = x2 + arrowSize
      originX = 'left'
      shadowX = 'right'
      if (this.autoflip && (left + popupWidth > containerWidth)) {
        const flipLeft = x1 - arrowSize - popupWidth
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
        if (this.autoflip && (x1 + popupWidth > containerWidth) && (x2 - popupWidth > 0)) {
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
        if (this.autoflip && (left < 0) && (x1 + popupWidth < containerWidth)) {
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
        if (this.autoflip && (y1 + popupHeight > containerHeight) && (y2 - popupHeight > 0)) {
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
        if (this.autoflip && (top < 0) && (y1 + popupHeight < containerHeight)) {
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

    this.style.top = `${top + scrollTop}px`
    this.style.left = `${left + scrollLeft}px`     
    this._setOrigin(originY, originX)
  }

  _focus() {
    if (this.restorefocus && !this._prevFocus) {
      this._prevFocus = document.activeElement
    }
    this.popup.focus()
  }

  _blur() {
    this.popup.blur()
    if (this._prevFocus) {
      if (this.restorefocus && typeof this._prevFocus.focus) {
        this._prevFocus.focus()
      }
      this._prevFocus = undefined
    }
  }

  // 设置原点 class
  _setOriginClass(value) {
    [...this.popup.classList.values()].forEach(className => {
      if (className !== value && className.startsWith('origin-')) {
        this.popup.classList.remove(className)
      }
    })
    this.popup.classList.add(value)
  }

  // 设置 css 变换原点
  _setOrigin(y, x) {
    this._setOriginClass(`origin-${y}-${x}`)
    this.popup.style.transformOrigin = `${y} ${x}`
  }

  _getNumber(attrName) {
    const attrValue = this.getAttribute(attrName)
    if (attrValue == null) return null
    const n = parseInt(attrValue, 10)
    return n == n ? Math.floor(n) : null
  }

  _setNumber(attrName, value) {
    if (typeof value === 'number') {
      value = Math.round(value)
    }
    else if (typeof value === 'string') {
      value = Math.round(parseInt(value, 10))
    }
    else {
      value = null
    }
    // null, NaN
    if (value == null || value !== value) {
      this.removeAttribute(attrName)
      return
    }
    this.setAttribute(attrName, '' + value)
  }

  _getBool(attrName) {
    return this.hasAttribute(attrName)
  }

  _setBool(attrName, value) {
    if (value === null || value === false) {
      this.removeAttribute(attrName)
    } else {
      this.setAttribute(attrName, '')
    }
  }

  // 启用鼠标交互
  _enableEvents() {
    this.popup.style.pointerEvents = ''
  }

  // 禁用鼠标交互
  _disableEvents() {
    this.popup.style.pointerEvents = 'none'
  }

  // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
  // 属性可能在 prototype 还没有链接到该实例前就设置了，
  // 在用户使用一些框架加载组件时，可能回出现这种情况，
  // 因此需要进行属性升级，确保 setter 逻辑能工作，
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop]
      delete this[prop]
      this[prop] = value
    }
  }
}

if (!customElements.get('blocks-popup')) {
  customElements.define('blocks-popup', BlocksPopup)
}
