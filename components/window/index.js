import '../button/index.js'
import '../icon/index.js'
import {
  __bg_base,
  __dark_bg_base,
  __border_color_base,
  __dark_border_color_base,
  __border_color_light,
  __dark_border_color_light,
  __color_danger,
  __color_primary,
  __fg_base,
  __dark_fg_base,
  __font_family,
  __height_base,
  __radius_base,
  __transition_duration,
  __bg_base_header,
} from '../theme/var.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { setRole } from '../../common/accessibility.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { openGetter, openSetter } from '../../common/propertyAccessor.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'
import { initOpenCloseAnimation } from '../../common/initOpenCloseAnimation.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: none;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  margin: auto;
  padding: 0;
  font-family: var(--font-family, ${__font_family});
  border-radius: var(--radius-base, ${__radius_base});
  color: var(--fg-base, ${__fg_base});
  font-size: 14px;
  backdrop-filter: blur(4px);
  transform-origin: top right;
}
:host([open]) {
  display: block;
  /* 描边 * 4 + 底部阴影 */
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .5),
    0px 11px 15px -7px rgba(0, 0, 0, 0.1);
}

:host(:focus-within) {
  background-color: var(--bg-base, ${__bg_base});
  backdrop-filter: none;
  opacity: 1;
  outline: 0 none;
  box-shadow:
    0px -1px 0px 0px rgba(0, 0, 0, 0.05),
    0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}

:host(:focus) {
  outline: 0 none;
}

:host([maximized]) {
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  left: 0 !important;
}
:host([minimized]) {
  height: auto !important;
}
:host([minimized]) #body {
  height: 0 !important;
}

#header-bg {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: var(--height-base, ${__height_base});
  z-index: -1;
  background-color: var(--bg-base-header, ${__bg_base_header});
  opacity: .8;
}
#body-bg {
  position: absolute;
  top: var(--height-base, ${__height_base});
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-color: var(--bg-base, ${__bg_base});
  opacity: .8;
}

#layout {
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column nowrap;
}

/* 标题栏 */
#header {
  box-sizing: border-box;
  flex: 0 0 auto;
  height: var(--height-base, ${__height_base});
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  /* actions(120) + padding(15) */
  padding-right: 135px;
  cursor: move;
  user-select: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .1);
}
:host([maximized]) #header {
  cursor: default;
}

/* 正文区 */
#body {
  position: relative;
  flex: 1 1 auto;
}

/* 状态栏 */
#footer {
  position: relative;
  flex: 0 0 auto;
}

#icon {
  flex: 0 0 auto;
}

#name {
  box-sizing: border-box;
  flex: 1 1 auto;
  padding: 0 10px;
}

#actions {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  box-sizing: border-box;
  display: flex;
  height: var(--height-base, ${__height_base});
  margin-left: 15px;
}
#actions button {
  display: block;
  position: relative;
  width: 40px;
  height: 100%;
  border: 0;
  background: transparent;
  text-align: center;
}
#actions button:focus {
  outline: none;
}

#maximize:after,
#minimize:after,
:host([maximized]) #maximize:before,
:host([minimized]) #minimize:before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 10px;
  margin: auto;
}

:host([maximized]) #maximize:before {
  height: 8px;
  border-top: 1px solid #aaa;
  border-right: 1px solid #aaa;
  bottom: 6px;
  left: 6px;
}
#maximize:after {
  height: 8px;
  border: 1px solid #aaa;
}
:host([maximized]) #maximize:before,
#maximize:hover:after {
  border-color: #888;
}

:host([minimized]) #minimize:before {
  width: 2px;
  height: 8px;
  background: #aaa;
}
#minimize:after {
  height: 2px;
  background: #aaa;
}
#minimize:hover:after,
:host([minimized]) #minimize:before {
  background: #888;
}

#close {
  fill: #aaa;
}
#close bl-icon {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 14px;
  height: 14px;
  margin: auto;
}
#minimize:hover,
#maximize:hover {
  background: rgba(0, 0, 0, .05);
}
#close:hover {
  background: var(--color-danger, ${__color_danger});
  fill: #fff;
}

:host([maximized]) #resize-top-left,
:host([minimized]) #resize-top-left,
:host([maximized]) #resize-top-right,
:host([minimized]) #resize-top-right,
:host([maximized]) #resize-bottom-right,
:host([minimized]) #resize-bottom-right,
:host([maximized]) #resize-bottom-left,
:host([minimized]) #resize-bottom-left,
:host([maximized]) #resize-top,
:host([minimized]) #resize-top,
:host([maximized]) #resize-right,
:host([minimized]) #resize-right,
:host([maximized]) #resize-bottom,
:host([minimized]) #resize-bottom,
:host([maximized]) #resize-left,
:host([minimized]) #resize-left {
  pointer-events: none;
}

#resize-top-left,
#resize-top-right,
#resize-bottom-right,
#resize-bottom-left {
  position: absolute;
  z-index: 3;
}
#resize-top,
#resize-right,
#resize-bottom,
#resize-left {
  position: absolute;
  z-index: 1;
}

#resize-top-left,
#resize-top-right,
#resize-bottom-right,
#resize-bottom-left {
  width: 4px;
  height: 4px;
}
#resize-top-left {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}
#resize-top-right {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}
#resize-bottom-right {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}
#resize-bottom-left {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

#resize-left,
#resize-right {
  top: 0;
  bottom: 0;
  width: 4px;
  height: 100%;
  cursor: ew-resize;
}
#resize-top,
#resize-bottom {
  width: 100%;
  height: 4px;
  cursor: ns-resize;
}
#resize-left {
  left: 0;
}
#resize-right {
  right: 0;
}
#resize-top {
  top: 0;
}
#resize-bottom {
  bottom: 0;
}

:host([dark]) {
  color: var(--fg-base-dark, ${__dark_fg_base});
}
:host([dark]) #body-bg {
  background-color: var(--bg-base-dark, ${__dark_bg_base});
}
</style>
`
const TEMPLATE_HTML = `
<div id="layout">
  <div id="header-bg"></div>
  <div id="body-bg"></div>

  <div id="resize-left"></div>
  <div id="resize-right"></div>
  <div id="resize-bottom"></div>
  <div id="resize-top-left"></div>
  <div id="resize-top-right"></div>
  <div id="resize-bottom-right"></div>
  <div id="resize-bottom-left"></div>

  <div id="actions">
    <button id="minimize"></button>
    <button id="maximize"></button>
    <button id="close"><bl-icon value="cross"></bl-icon></button>
  </div>

  <header id="header">
    <div id="resize-top"></div>
    <div id="icon"></div>
    <div id="name"></div>
  </header>

  <section id="body">
    <div id="content">
      <slot></slot>
    </div>
    <footer id="footer">
      <slot name="footer"></slot>
    </footer>    
  </section>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

const capturefocusGetter = boolGetter('capturefocus')
const capturefocusSetter = boolSetter('capturefocus')
const appendToBodyGetter = boolGetter('append-to-body')
const appendToBodySetter = boolSetter('append-to-body')

class BlocksWindow extends HTMLElement {
  static get observedAttributes() {
    return [
      // 显示状态
      'open',
      // 标题图标
      'icon',
      // 标题
      'name',
      'close-button',
      'maximize-button',
      'minimize-button',
      'maximized',
      'minimized',
      // 捕获焦点，tab 键不会将焦点移出 Dialog
      'capturefocus',
      'dark',
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$header = shadowRoot.getElementById('header')
    this.$body = shadowRoot.getElementById('body')
    this.$actions = shadowRoot.getElementById('actions')
    this.$closeButton = shadowRoot.getElementById('close')
    this.$maximizeButton = shadowRoot.getElementById('maximize')
    this.$minimizeButton = shadowRoot.getElementById('minimize')
    this.$icon = shadowRoot.getElementById('icon')
    this.$name = shadowRoot.getElementById('name')

    this.$closeButton.onclick = () => {
      this.open = false
    }

    this.$maximizeButton.onclick = () => {
      if (this.maximized) {
        this.cancelMaximize()
      }
      else {
        this.maximize()
      }
    }

    this.$minimizeButton.onclick = () => {
      if (this.minimized) {
        this.cancelMinimize()
      }
      else {
        this.minimize()
      }
    }

    initOpenCloseAnimation(this, {
      onEnd: () => {
        if (this.open) {
          this._focus()
          dispatchEvent(this, 'open')
        }
        else {
          this._blur()
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

    this._initMoveEvents()
  }

  get appendToBody() {
    return appendToBodyGetter(this)
  }

  set appendToBody(value) {
    appendToBodySetter(value)
  }  

  get capturefocus() {
    return capturefocusGetter(this)
  }

  set capturefocus(value) {
    capturefocusSetter(this, value)
  }

  get maximized() {
    return boolGetter('maximized')(this)
  }

  set maximized(value) {
    boolSetter('maximized')(this, value)
  }

  get minimized() {
    return boolGetter('minimized')(this)
  }

  set minimized(value) {
    boolSetter('minimized')(this, value)
  }

  get name() {
    return this.getAttribute('name')
  }

  set name(value) {
    this.setAttribute('name', value)
  }

  get open() {
    return openGetter(this)
  }

  set open(value) {
    openSetter(this, value)
  }  

  render() {
  }

  minimize() {
    this.minimized = true
  }

  cancelMinimize() {
    this.minimized = false
  }

  maximize() {
    this.maximized = true
  }

  cancelMaximize() {
    this.maximized = false
  }

  connectedCallback() {
    setRole(this, 'window')

    // 将 tabindex 设置在 host 上，
    // 因为 tabindex 在 layout 上的话，鼠标点击 slot 里面的内容时会反复 blur
    this.setAttribute('tabindex', '-1')

    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }
  }

  _initMoveEvents() {
    // 拖拽 header 移动
    let startX
    let startY
    let startPageX
    let startPageY

    const isHeader = (e) => {
      if (this.$actions.contains(e.target)) return false
      if (this.$header.contains(e.target)) return true
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
      if (this.maximized || !isHeader(e)) return
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

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'open') {
      this._updateVisible()
    }

    if (name === 'name') {
      this._renderTitle()
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

  _renderTitle() {
    this.$name.textContent = this.name ?? ''
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
      this.classList.remove('close-animation')
      this.classList.add('open-animation')
      if (!this.style.left) {
        this.style.left = (document.body.clientWidth - this.offsetWidth) / 2 + 'px'
      }
      if (!this.style.top) {
        this.style.top = (document.body.clientHeight - this.offsetHeight) / 2 + 'px'
      }      
    }
    else {
      this.classList.remove('open-animation')
      this.classList.add('close-animation')
    }
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
}

if (!customElements.get('bl-window')) {
  customElements.define('bl-window', BlocksWindow)
}
