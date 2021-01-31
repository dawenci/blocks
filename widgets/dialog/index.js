import '../button/index.js'
import {
  $colorFontBase,
  $fontFamily,
  $radiusBase,
  $transitionDuration,
} from '../theme/var.js'
import { boolGetter, boolSetter } from '../core/property.js'
import { setRole } from '../core/accessibility.js'
import { dispatchEvent } from '../core/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'

const TEMPLATE_CSS = `
<style>
:host {
  font-family: ${$fontFamily};
  position:absolute;
  margin:auto;
  z-index:-1;
  pointer-events: none;
  z-index:10;
}

:host([open]) {
  pointer-events: auto;
}

:host(:focus) {
  outline: 0 none;
}

/* 遮罩 */
#mask {
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  z-index:100;
  background: rgba(0,0,0,.3);
  opacity:0;
}
:host([open]) #mask {
  opacity:1;
}

/* 对话框 */
#layout {
  position:relative;
  z-index: 100;
  box-sizing: border-box;
  display:inline-flex;
  flex-flow: column nowrap;
  margin:auto;
  box-sizing: border-box;
  max-width: calc(100vw - 20px);
  max-height: calc(100vh - 20px);
  border-radius: ${$radiusBase};
  background-color: #fff;

  opacity:0;
  transform: scale(0);
  transition: transform ${$transitionDuration} cubic-bezier(.645, .045, .355, 1),
    opacity ${$transitionDuration} cubic-bezier(.645, .045, .355, 1);
}

:host([open]) #layout {
  opacity:1;
  transform:scale(1);
}

#layout {
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.1),
    0px 24px 38px 3px rgba(0, 0, 0, 0.10),
    0px 9px 46px 8px rgba(0, 0, 0, 0.10);
}
:host(:focus-within) #layout, #layout:focus-within {
  outline: 0 none;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}

/* 标题栏 */
header {
  box-sizing: border-box;
  flex: 1 1 auto;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  padding: 10px 15px;
  line-height: 1.428571429;
  cursor: move;
  user-select: none;
}
.no-header header {
  display: none;
}
:host([closeable]) header {
  padding-right: 45px;
}

:host([closeable]) .no-header section {
  min-height: 38px;
  padding-right: 45px;
}
:host([closeable]) .no-header.no-footer section {
  min-height: 78px;
}

header h1 {
  margin: 0;
  font-weight: 700;
  font-size: 14px;
  color: #4c5161;
  user-select: none;
  cursor: default;
}
h1:empty {
  display: none;
}

/* 内容区 */
section {
  box-sizing: border-box;
  display:flex;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  flex:1;
  flex-direction:column;
  overflow: auto;
}
.no-header section {
  padding-top: 15px;
}
.no-footer section {
  padding-top: 10px;
  padding-bottom: 30px;
}
.no-header.no-footer section {
  padding-top: 30px;
  padding-bottom: 30px;
}

/* 脚部 */
footer {
  box-sizing: border-box;
  padding: 10px 15px;
  text-align: right;
}
.no-footer footer {
  display: none;
}

/* 关闭按钮 */
#close {
  overflow: hidden;
  position:absolute;
  z-index: 1;
  right:10px;
  top:10px;
  display: block;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0 none;
  background: transparent;
  fill: #aaa;
}
#close:hover,
#close:focus,
#close:active {
  background-color: transparent;
  fill: #888;
  outline: 0 none;
}

.no-header #close {
  top: 15px;
}
.no-header.no-footer #close {
  top: 30px;
}

#first, #last, #first:focus, #last:focus {
  overflow: hidden;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0 none;
}

:host-context([dark]) #layout,
:host([dark]) #layout {
  background-color: ${$colorFontBase};
  color: #fff;
}
:host-context([dark]) header h1,
:host([dark]) header h1 {
  color: #fff;
}
</style>
`
const TEMPLATE_HTML = `
<div id="layout">
  <header>
    <slot name="header">
      <h1></h1>
    </slot>
  </header>

  <section>
    <slot></slot>
  </section>

  <footer>
    <slot name="footer"></slot>
  </footer>

  <button id="close"></button>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

function getBodyScrollBarWidth() {
  const $outer = document.createElement('div')
  const $inner = $outer.cloneNode()
  $outer.style.cssText = 'visibility: hidden;overflow:scroll;position: absolute;top: 0;left: 0;width: 100px;'
  $inner.style.cssText = 'width: 100%;'
  $outer.appendChild($inner)
  document.body.appendChild($outer)
  return $outer.offsetWidth - $inner.offsetWidth
}

const openGetter = boolGetter('open')
const openSetter = boolSetter('open')
const maskGetter = boolGetter('mask')
const maskSetter = boolSetter('mask')
const closeableGetter = boolGetter('closeable')
const closeableSetter = boolSetter('closeable')
const capturefocusGetter = boolGetter('capturefocus')
const capturefocusSetter = boolSetter('capturefocus')
const appendToBodyGetter = boolGetter('append-to-body')
const appendToBodySetter = boolSetter('append-to-body')

class BlocksDialog extends HTMLElement {
  static get observedAttributes() {
    return [
      // 显示状态
      'open',
      // 标题
      'title',
      // 是否提供关闭按钮
      'closeable',
      // 捕获焦点，tab 键不会将焦点移出 Dialog
      'capturefocus',
      // 显示遮罩
      'mask',
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$layout = shadowRoot.getElementById('layout')
    this.$mask = document.createElement('div')
    this.$mask.style.cssText = `
      display: none;
      position:absolute;
      left:0;
      top:0;
      right:0;
      bottom:0;
      z-index:10;
      background: rgba(0,0,0,.3);
      opacity:0;
      transition: opacity ${$transitionDuration} cubic-bezier(.645, .045, .355, 1);
    `

    this.remove = false

    // 避免点击 mask 的时候，dialog blur
    // 注：mousedown 到 mouseup 之间，dialog 会发生 blur
    {
      this._refocus = e => {
        this.focus()
        this.removeEventListener('blur', this._refocus)
      }
      this.$mask.addEventListener('mousedown', e => {
        this.focus()
        this.addEventListener('blur', this._refocus)
      })
      this.$mask.addEventListener('mouseup', e => {
        this.removeEventListener('blur', this._refocus)
      })
    }

    // 过渡开始
    this.$layout.ontransitionstart = ev => {
      if (ev.target !== this.$layout || ev.propertyName !== 'opacity') return
      this._disableEvents()
    }

    // 过渡进行
    this.$layout.ontransitionrun = ev => { }

    // 过渡取消
    this.$layout.onontransitioncancel = ev => { }

    // 过渡结束
    this.$layout.ontransitionend = ev => {
      if (ev.target !== this.$layout || ev.propertyName !== 'opacity') return
      this._enableEvents()

      if (this.open) {
        this._focus()
        dispatchEvent(this, 'open')
      }
      else {
        this._blur()
        this.$layout.style.display = 'none'
        this.$mask.style.display = 'none'

        if (this.remove) {
          this.parentElement && this.parentElement.removeChild(this)
        }
        dispatchEvent(this, 'close')
      }
    }

    this.$layout.addEventListener('slotchange', e => {
      this.render()
    })

    if (this.capturefocus) {
      this._captureFocus()
    }
  }

  get open() {
    return openGetter(this)
  }

  set open(value) {
    openSetter(this, value)
  }

  get mask() {
    return maskGetter(this)
  }

  set mask(value) {
    maskSetter(this, value)
  }

  get title() {
    return this.getAttribute('title')
  }

  set title(value) {
    this.setAttribute('title', value)
    this._renderHeader()
  }

  get closeable() {
    return closeableGetter(this)
  }

  set closeable(value) {
    closeableSetter(this, value)
  }

  get capturefocus() {
    return capturefocusGetter(this)
  }

  set capturefocus(value) {
    capturefocusSetter(this, value)
  }

  get appendToBody() {
    return appendToBodyGetter(this)
  }

  set appendToBody(value) {
    appendToBodySetter(value)
  }

  render() {
    this._renderHeader()
    this._renderFooter()
    this._renderClose()
  }

  // 执行过渡前的准备工作，确保动画正常
  _prepareForAnimate() {
    this.$layout.style.display = ''
    this.$mask.style.display = ''
    this.$layout.offsetHeight
    this.$mask.offsetHeight
  }

  // 启用鼠标交互
  _enableEvents() {
    this.$layout.style.pointerEvents = ''
  }

  // 禁用鼠标交互
  _disableEvents() {
    this.$layout.style.pointerEvents = 'none'
  }

  // 强制捕获焦点，避免 Tab 键导致焦点跑出去 popup 外面
  _captureFocus() {
    this.$firstFocusable = this.$layout.querySelector('#first') || this.$layout.insertBefore(document.createElement('button'), this.$layout.firstChild)
    this.$lastFocusable = this.$layout.querySelector('#last') || this.$layout.appendChild(document.createElement('button'))
    this.$firstFocusable.id = 'first'
    this.$lastFocusable.id = 'last'
    this.$firstFocusable.onkeydown = e => {
      if (e.key === 'Tab' && e.shiftKey) {
        this.$lastFocusable.focus()
      }
    }
    this.$lastFocusable.onkeydown = e => {
      if (e.key === 'Tab' && !e.shiftKey) {
        this.$firstFocusable.focus()
      }
    }
  }

  // 停止强制捕获焦点
  _stopCaptureFocus() {
    if (this.$firstFocusable && this.$firstFocusable.parentElement) {
      this.$layout.removeChild(this.$firstFocusable)
    }
    if (this.$firstFocusable && this.$lastFocusable.parentElement) {
      this.$layout.removeChild(this.$lastFocusable)
    }
  }

  _updateVisible() {
    this._prepareForAnimate()
    if (this.open) {
      this._lockScroll()
      this._animateOpen()
    }
    else {
      this._unlockScroll()
      this._animateClose()
    }
  }

  _animateOpen() {
    // 强制执行动画
    this.$layout.offsetHeight
    this.$layout.style.opacity = ''
    this.$layout.style.transform = ''

    if (!this.style.left) {
      this.$layout.style.left = (document.body.clientWidth - this.$layout.offsetWidth) / 2 + 'px'
    }
    if (!this.style.top) {
      this.$layout.style.top = (document.body.clientHeight - this.$layout.offsetHeight) / 2 + 'px'
    }

    this.$mask.offsetHeight
    this.$mask.style.opacity = ''
  }

  _animateClose() {
    // 强制执行动画
    this.$layout.offsetHeight
    this.$layout.style.opacity = '0'
    this.$layout.style.transform = 'scale(0)'

    this.$mask.offsetHeight
    this.$mask.style.opacity = '0'
  }

  _lockScroll() {
    if (!this.isScrollLocked) {
      this.bodyPaddingRight = document.body.style.paddingRight
      this.bodyOverflowY = document.body.style.overflowY
      this.computedBodyPaddingRight = parseInt(getComputedStyle(document.body).paddingRight, 10)
    }

    const scrollBarWidth = getBodyScrollBarWidth()
    let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
    let bodyOverflowY = getComputedStyle(document.body).overflowY
    if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && !this.isScrollLocked) {
      document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
    }

    document.body.style.overflowY = 'hidden'
    this.isScrollLocked = true
  }

  _unlockScroll() {
    if (this.isScrollLocked) {
      document.body.style.paddingRight = this.bodyPaddingRight
      document.body.style.overflowY = this.bodyOverflowY
      this.isScrollLocked = false
    }
  }

  _hostChild(selector) {
    return this.querySelector(selector)
  }

  _shadowChild(selector) {
    return this.shadowRoot.querySelector(selector)
  }

  _renderClose() {
    if (this.closeable) {
      if (!this.$close) {
        this.$close = document.createElement('button')
        this.$close.id = 'close'
        this.$close.appendChild(getRegisteredSvgIcon('cross'))
        this.$close.onclick = () => {
          this.open = false
        }
        if (this.lastFocusable) {
          this.$layout.insertBefore(this.$close, this.$lastFocusable)
        }
        else {
          this.$layout.appendChild(this.$close)
        }
      }
    }
    else {
      if (this.$close) {
        this.$close.parentElement.removeChild(this.$close)
        this.$close = null
      }
    }
  }

  _renderHeader() {
    if (this._hostChild('[slot="header"]')) {
      this.$layout.classList.remove('no-header')
    }
    else if (this.title) {
      this.$layout.classList.remove('no-header')
      const title = this._shadowChild('h1')
      title.innerText = this.title
    }
    else {
      this.$layout.classList.add('no-header')
    }
  }

  _renderFooter() {
    if (this.querySelector('[slot="footer"]')) {
      this.$layout.classList.remove('no-footer')
    }
    else {
      this.$layout.classList.add('no-footer')
    }
  }

  _focus() {
    if (!this._prevFocus) {
      this._prevFocus = document.activeElement
    }
    this.focus()
  }

  _blur() {
    this.blur()
    if (this._prevFocus) {
      this._prevFocus.focus()
      this._prevFocus = undefined
    }
  }

  connectedCallback() {
    setRole(this, 'dialog')

    // 将 tabindex 设置在 host 上，
    // 因为 tabindex 在 popup 上的话，鼠标点击 slot 里面的内容时会反复 blur
    this.setAttribute('tabindex', '-1')

    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }
    if (this.mask) {
      this.parentElement.insertBefore(this.$mask, this)
    }

    this._renderHeader()
    this._renderFooter()

    // 设置初始样式，确保动画生效
    if (!this.open) {
      this.$layout.style.display = 'none'
      this.$layout.style.opacity = '0'
      this.$layout.style.transform = 'scale(0)'
    }

    // 拖拽 header 移动
    {
      let startX
      let startY
      let startPageX
      let startPageY

      const isHeader = (e) => {
        if (this.$layout.querySelector('header').contains(e.target)) return true
        // maybe header slot
        if (this.contains(e.target)) {
          let el = e.target
          while (el && el !== this) {
            if (el.slot === 'header') return true
            el = el.parentElement
          }
        }
        return false
      }

      const move = (e) => {
        this.style.left = startX + (e.pageX - startPageX) + 'px'
        this.style.top = startY + (e.pageY - startPageY) + 'px'
      }

      const up = () => {
        removeEventListener('mousemove', move)
        removeEventListener('mouseup', up)
      }

      this.$layout.onmousedown = (e) => {
        if (!isHeader(e)) return
        startPageX = e.pageX
        startPageY = e.pageY
        const marginLeft = parseFloat(window.getComputedStyle(this).marginLeft || '0')
        const marginTop = parseFloat(window.getComputedStyle(this).marginTop || '0')
        startX = this.offsetLeft - marginLeft
        startY = this.offsetTop - marginTop
        addEventListener('mousemove', move)
        addEventListener('mouseup', up)
      }
    }
  }

  disconnectedCallback() {
    if (this.$mask && this.$mask.parentElement) {
      this.$mask.parentElement.removeChild(this.$mask)
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'open' && this.shadowRoot) {
      this._updateVisible()
    }

    if (name === 'mask') {
      if (this.mask) {
        this.parentElement.insertBefore(this.$mask, this)
      }
      else if (this.$mask.parentElement) {
        this.$mask.parentElement.removeChild(this.$mask)
      }
    }

    if (name === 'capturefocus') {
      if (this.capturefocus) {
        this._captureFocus()
      }
      else {
        this._stopCaptureFocus()
      }
    }
  }
}

if (!customElements.get('blocks-dialog')) {
  customElements.define('blocks-dialog', BlocksDialog)
}
