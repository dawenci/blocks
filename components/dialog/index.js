import '../button/index.js'
import '../modal-mask/index.js'
import {
  __bg_base,
  __bg_baseDark,
  __fg_base,
  __fg_baseDark,
  __font_family,
  __radius_base,
  __transition_duration,
} from '../theme/var.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { setRole } from '../../common/accessibility.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { closeableGetter, closeableSetter, openGetter, openSetter } from '../../common/propertyAccessor.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'
import { initOpenCloseAnimation } from '../../common/initOpenCloseAnimation.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: none;
  font-family: var(--font-family, ${__font_family});
  position:absolute;
  margin:auto;
  z-index:-1;
  pointer-events: none;
  z-index:10;
}

:host([open]) {
  display: block;
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
  border-radius: var(--radius-base, ${__radius_base});
  background-color: var(--bg-base, ${__bg_base});
  color: var(--fg-base, ${__fg_base});
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

:host([dark]) #layout,
:host([dark]) header h1 {
  background-color: var(--bg-base-dark, ${__bg_baseDark});
  color: var(--fg-base-dark, ${__fg_baseDark});
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

const maskGetter = boolGetter('mask')
const maskSetter = boolSetter('mask')
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
      'dark',
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$layout = shadowRoot.getElementById('layout')
    this.$mask = document.createElement('bl-modal-mask')
    // this.$mask.style.cssText = `
    //   display: none;
    //   position:absolute;
    //   left:0;
    //   top:0;
    //   right:0;
    //   bottom:0;
    //   z-index:10;
    //   background: rgba(0,0,0,.3);
    //   opacity:0;
    //   transition: opacity var(--transition-duration, ${__transition_duration}) cubic-bezier(.645, .045, .355, 1);
    // `

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

    initOpenCloseAnimation(this, {
      onEnd: () => {
        if (this.open) {
          this._focus()
          dispatchEvent(this, 'open')
        }
        else {
          this._blur()
          // this.$mask.style.display = 'none'

          if (this.remove) {
            this.parentElement && this.parentElement.removeChild(this)
          }
          dispatchEvent(this, 'close')
        }
      }
    })

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
    if (this.open) {
      this._lockScroll()
      this._animateOpen()
      if (this.$mask) this.$mask.open = true
    }
    else {
      this._unlockScroll()
      this._animateClose()
      if (this.$mask) this.$mask.open = false
    }
  }

  _animateOpen() {
    this.classList.remove('close-animation')
    this.classList.add('open-animation')

    if (!this.style.left) {
      this.style.left = (document.body.clientWidth - this.offsetWidth) / 2 + 'px'
    }
    if (!this.style.top) {
      this.style.top = (document.body.clientHeight - this.offsetHeight) / 2 + 'px'
    }
  }

  _animateClose() {
    this.classList.remove('open-animation')
    this.classList.add('close-animation')
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

if (!customElements.get('bl-dialog')) {
  customElements.define('bl-dialog', BlocksDialog)
}
