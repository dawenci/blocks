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

const AnchorSide = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
}

const AnchorAlign = {
  Start: 'start',
  End: 'end',
  Center: 'center'
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
:host(:focus-within) #popup.shadow-top-left,
#popup:focus-within.shadow-top-left {
  box-shadow: -1px -1px 3px -1px rgba(0, 0, 0, 0.1), -2px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.shadow-top-right,
#popup:focus-within.shadow-top-right {
  box-shadow: 1px -1px 3px -1px rgba(0, 0, 0, 0.1), 2px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.shadow-bottom-left,
#popup:focus-within.shadow-bottom-left {
  box-shadow: -1px 1px 3px -1px rgba(0, 0, 0, 0.1), -2px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.shadow-bottom-right,
#popup:focus-within.shadow-bottom-right {
  box-shadow: 1px 1px 3px -1px rgba(0, 0, 0, 0.1), 2px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.shadow-top-center,
#popup:focus-within.shadow-top-center {
  box-shadow: 0px -1px 3px -1px rgba(0, 0, 0, 0.1), 0px -2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.shadow-bottom-center,
#popup:focus-within.shadow-bottom-center {
  box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.shadow-center-right,
#popup:focus-within.shadow-center-right {
  box-shadow: 1px 0px 3px -1px rgba(0, 0, 0, 0.1), 2px 0px 4px 1px rgba(0, 0, 0, 0.05), 0px 0 3px rgba(0, 0, 0, 0.05);
}
:host(:focus-within) #popup.shadow-center-left,
#popup:focus-within.shadow-center-left {
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

/* 阴影在左上方 */
/* 垂直模式，箭头指向下方，位置靠右 */
.shadow-top-left.vertical #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  bottom: -5px;
  right: 10px;
}

/* 水平模式，箭头指向右方，位置靠下 */
.shadow-top-left.horizontal #arrow 
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  bottom: 10px;
  right: -5px;
}

/* 阴影在右上方 */
/* 垂直模式，箭头指向下方，位置靠左 */
.shadow-top-right.vertical #arrow {}
/* 未知原因 BUG, 上方多写一行才会生效 */
.shadow-top-right.vertical #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  bottom: -5px;
  left: 10px;
}

/* 水平模式，箭头指向左方，位置靠下 */
.shadow-top-right.horizontal #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  bottom: 10px;
  left: -5px;
}

/* 阴影在右下方 */
/* 垂直模式，箭头指向上方，位置靠左 */
.shadow-bottom-right.vertical #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  top: -5px;
  left: 10px;
}

/* 水平模式，箭头指向左方，位置靠上 */
.shadow-bottom-right.horizontal #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  top: 10px;
  left: -5px;
}


/* 阴影在左下方 */
/* 垂直模式，箭头指向上方，位置靠右 */
.shadow-bottom-left.vertical #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  top: -5px;
  right: 10px;
}

/* 水平模式，箭头指向右方，位置靠上 */
.shadow-bottom-left.horizontal #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  top: 10px;
  right: -5px;
}

/* 阴影在正上方 */
/* 箭头指向下方，位置居中 */
.shadow-top-center.vertical #arrow {
  border-bottom: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  bottom: -5px;
  left: 0;
  right: 0;
}

/* 阴影在正右方 */
/* 箭头指向左方，位置居中 */
.shadow-center-right.horizontal #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-left: 1px solid rgba(0,0,0,.08);
  top: 0;
  bottom: 0;
  left: -5px;
}

/* 阴影在正下方 */
/* 箭头指向上方，位置居中 */
.shadow-bottom-center.vertical #arrow {
  border-top: 1px solid rgba(0,0,0,.08);
  border-right: 1px solid rgba(0,0,0,.08);
  top: -5px;
  left: 0;
  right: 0;
}

/* 阴影在正左方 */
/* 箭头指向右方，位置居中 */
.shadow-center-left.horizontal #arrow {
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
      'anchorx',
      'anchory',
      'anchorwidth',
      'anchorheight',
      'anchorside',
      'anchoralign',
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

  get anchorx() {
    return this._getNumber('anchorx')
  }

  set anchorx(n) {
    this._setNumber('anchorx', n)
  }

  get anchory() {
    return this._getNumber('anchory')
  }

  set anchory(n) {
    this._setNumber('anchory', n)
  }

  get anchorwidth() {
    return this._getNumber('anchorwidth')
  }

  set anchorwidth(n) {
    this._setNumber('anchorwidth', n)
  }

  get anchorheight() {
    return this._getNumber('anchorheight')
  }

  set anchorheight(n) {
    this._setNumber('anchorheight', n)
  }

  get anchorside() {
    return this.getAttribute('anchorside') || AnchorSide.Bottom
  }

  set anchorside(n) {
    this.setAttribute('anchorside', n)
  }

  get anchoralign() {
    return this.getAttribute('anchoralign') || AnchorAlign.Start
  }

  set anchoralign(n) {
    this.setAttribute('anchoralign', n)
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
    this._upgradeProperty('anchorx')
    this._upgradeProperty('anchory')
    this._upgradeProperty('anchorwidth')
    this._upgradeProperty('anchorheight')
    this._upgradeProperty('anchorside')
    this._upgradeProperty('anchoralign')
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
        if (this.shadowRoot && newValue !== null) {
          this._updateVisible()
        }
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
    this.style.display = ''
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

  _updateClass() {
    if (this.anchorside === AnchorSide.Left || this.anchorside === AnchorSide.Right) {
      this.popup.classList.add('horizontal')
      this.popup.classList.remove('vertical')
    }
    else {
      this.popup.classList.remove('horizontal')
      this.popup.classList.add('vertical')
    }
  }

  _updateArrow() {
    if (this.arrow) {
      this.popupArrow.style.display = 'block'
    }
    else {
      this.popupArrow.style.display = 'none'
    }
  }

  updatePosition() {
    if (!this.open) return

    // 锚定位置
    const anchorLeft = this.anchorx || 0
    const anchorTop = this.anchory || 0
    const anchorRight = anchorLeft + (this.anchorwidth || 0)
    const anchorBottom = anchorTop + (this.anchorheight || 0)

    const popup = this.popup
    const popupWidth = popup.offsetWidth
    const popupHeight = popup.offsetHeight

    const containerWidth = document.body.scrollWidth
    const containerHeight = document.body.scrollHeight
    const scrollTop = document.documentElement.scrollTop + document.body.scrollTop
    const scrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft

    let top
    let left
    let shadowX
    let shadowY
    let tranformX
    let tranformY

    const verticalFlip = () => {
      shadowY = ({ Top: 'bottom', Bottom: 'top', Center: 'center' })[shadowY]
      tranformY = ({ Top: 'bottom', Bottom: 'top', Center: 'center' })[tranformY]
    }

    const horizontalFlip = () => {
      shadowX = ({ Left: 'right', Right: 'left' })[shadowX]
      tranformX = ({ Left: 'right', Right: 'left' })[tranformX]
    }

    const arrowSize = this.arrow ? ARROW_SIZE : 0
    const anchorTopY = anchorTop - popupHeight - arrowSize
    const anchorBottomY = anchorBottom + arrowSize
    const anchorLeftX = anchorLeft - popupWidth - arrowSize
    const anchorRightX = anchorRight + arrowSize

    // 配置吸附方向
    switch (this.anchorside) {
      // 吸附在 anchor 的上边
      case AnchorSide.Top: {
        top = anchorTopY
        tranformY = 'bottom'
        shadowY = 'top'
        // 如果 popup 溢出视口，则检查翻转吸附在 anchor 的下边是否更好，如果是，则翻转
        if (this.autoflip && (top < 0) && (anchorBottomY + popupHeight < containerHeight)) {
          top = anchorBottomY
          verticalFlip()
        }
        break
      }

      // 吸附在 anchor 的下边
      case AnchorSide.Bottom: {
        top = anchorBottomY
        tranformY = 'top'
        shadowY = 'bottom'
        // 如果 popup 溢出视口，则检查翻转吸附在 anchor 的上边是否更好，如果是，则翻转
        if (this.autoflip && (top + popupHeight > containerHeight) && anchorTopY > 0) {
          top = anchorTopY
          verticalFlip()
        }
        break
      }

      // 吸附在 anchor 的右边
      case AnchorSide.Right: {
        left = anchorRightX
        tranformX = 'left'
        shadowX = 'right'
        if (this.autoflip && (left + popupWidth > containerWidth) && anchorLeftX > 0) {
          left = anchorLeftX
          horizontalFlip()
        }
        break
      }

      // 吸附在 anchor 的左边
      case AnchorSide.Left: {
        left = anchorLeftX
        tranformX = 'right'
        shadowX = 'left'
        if (this.autoflip && (left < 0) && (anchorRightX + popupWidth < containerWidth)) {
          left = anchorRightX
          horizontalFlip()
        }
        break
      }
    }

    // 配置对齐方向
    const isVertical = this.anchorside === AnchorSide.Top || this.anchorside === AnchorSide.Bottom
    if (isVertical) {
      if (this.anchoralign === AnchorAlign.Start) {
        // 与 anchor 左侧对齐
        left = anchorLeft
        tranformX = 'left'
        shadowX = 'right'
        // 如果与 popup 的右侧溢出视口，则检查向左侧渲染是否更好，是则翻转成右对齐
        if (this.autoflip && (anchorLeft + popupWidth > containerWidth) && (anchorRight - popupWidth > 0)) {
          left = anchorRight - popupWidth
          horizontalFlip()
        }
      }
      if (this.anchoralign === AnchorAlign.Center) {
        // 与 anchor 中对齐，不翻转
        left = (anchorLeft + (anchorRight - popupWidth)) / 2
        tranformX = 'center'
        shadowX = 'center'
      }
      if (this.anchoralign === 'end') {
        // 与 anchor 右侧对齐
        left = anchorRight - popupWidth
        tranformX = 'right'
        shadowX = 'left'
        // 如果与 popup 的左侧溢出视口，则检查向右侧渲染是否更好，是则翻转
        if (this.autoflip && (left < 0) && (anchorLeft + popupWidth < containerWidth)) {
          left = anchorLeft
          horizontalFlip()
        }
      }
    }
    else {
      if (this.anchoralign === AnchorAlign.Start) {
        // 默认与 anchor 顶部对齐
        top = anchorTop
        tranformY = 'bop'
        shadowY = 'bottom'
        // 如果与 popup 的下方溢出视口，则检查向上渲染是否更好，是则翻转
        if (this.autoflip && (anchorTop + popupHeight > containerHeight) && (anchorBottom - popupHeight > 0)) {
          top = anchorBottom - popupHeight
          verticalFlip()
        }
      }
      if (this.anchoralign === AnchorAlign.Center) {
        // 与 anchor 中对齐，不翻转
        top = (anchorTop + (anchorBottom - popupHeight)) / 2
        tranformY = 'center'
        shadowY = 'center'
      }
      if (this.anchoralign === 'end') {
        // 默认与 anchor 底部对齐
        top = anchorBottom - popupHeight
        tranformY = 'bottom'
        shadowY = 'top'
        // 如果与 popup 的上方溢出视口，则检查向下渲染是否更好，是则翻转
        if (this.autoflip && (top < 0) && (anchorTop + popupHeight < containerHeight)) {
          top = anchorTop + popupHeight
          verticalFlip()
        }
      }
    }

    this.style.top = `${top + scrollTop}px`
    this.style.left = `${left + scrollLeft}px`

    this._setShadowClass(`shadow-${shadowY}-${shadowX}`)
    this._setOrigin(tranformY, tranformX)
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

  // 设置阴影样式 class
  _setShadowClass(value) {
    [...this.popup.classList.values()].forEach(className => {
      if (className !== value && className.startsWith('shadow-')) {
        this.popup.classList.remove(className)
      }
    })
    this.popup.classList.add(value)
  }

  // 设置 css 变换原点
  _setOrigin(y, x) {
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
