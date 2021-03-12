import '../button/index.js'
import '../icon/index.js'
import {
  __bg_base,
  __bg_baseDark,
  __border_color_base,
  __border_color_baseDark,
  __border_color_light,
  __border_color_lightDark,
  __color_danger,
  __fg_base,
  __fg_baseDark,
  __font_family,
  __height_base,
  __radius_base,
  __transition_duration,
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
  border: 1px solid var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  color: var(--fg-base, ${__fg_base});
  font-size: 14px;
  backdrop-filter: blur(4px);
}
:host([open]) {
  display: block;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.1);
}

:host(:focus-within) {
  border: 1px solid transparent;
  background-color: var(--bg-base, ${__bg_base});
  backdrop-filter: none;
  opacity: 1;
  outline: 0 none;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}

:host(:focus) {
  outline: 0 none;
}

#bg {
  position: absolute;
  top: 0;
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
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  cursor: move;
  user-select: none;
  box-shadow: 0 0 0 1px var(--border-color-light, ${__border_color_light});
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
  box-sizing: border-box;
  display: flex;
  height: 100%;
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
#minimize:after {
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
#maximize:after {
  height: 8px;
  border: 1px solid #aaa;
}
#maximize:hover:after {
  border-color: #888;
}
#minimize:after {
  height: 2px;
  background: #aaa;
}
#minimize:hover:after {
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
  background: rgba(0, 0, 0, .1);
}
#close:hover {
  background: var(--color-danger, ${__color_danger});
  fill: #fff;
}

#body {
  flex: 1 1 auto;
}

#footer {
  flex: 0 0 auto;
}

:host([dark]) {
  background-color: var(--bg-base-dark, ${__bg_baseDark});
  border: 1px solid var(--border-color-base-dark, ${__border_color_baseDark});
  color: var(--fg-base-dark, ${__fg_baseDark});
}

:host([dark]) #header {
  border-bottom: 1px solid var(--border-color-light-dark, ${__border_color_lightDark});
}
</style>
`
const TEMPLATE_HTML = `
<div id="layout">
  <div id="bg"></div>
  <header id="header">
    <div id="icon"></div>
    <div id="name"></div>
    <div id="actions">
      <button id="minimize"></button>
      <button id="maximize"></button>
      <button id="close"><bl-icon value="cross"></bl-icon></button>
    </div>
  </header>

  <section id="body">
    <slot></slot>
  </section>

  <footer id="footer">
    <slot name="footer"></slot>
  </footer>
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
      if (this._restoreSize) {
        this.restoreSize()
      }
      else {
        this.maximize()
      }
    }

    this.$minimizeButton.onclick = () => {
      if (this._restoreSize) {
        this.restoreSize()
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
  }

  get open() {
    return openGetter(this)
  }

  set open(value) {
    openSetter(this, value)
  }

  get name() {
    return this.getAttribute('name')
  }

  set name(value) {
    this.setAttribute('name', value)
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
  }

  minimize() {
    this.storeSize()
    this.style.height = ''
    this.$body.style.display = 'none'
  }

  maximize() {
    this.storeSize()
    this.style.width = '100%'
    this.style.height = '100%'
    this.style.left = '0'
    this.style.top = '0'
  }

  storeSize() {
    const style = getComputedStyle(this)
    this._restoreSize = {
      width: style.width,
      height: style.height,
      top: style.top,
      left: style.left,
    }
  }

  restoreSize() {
    if (this._restoreSize) {
      this.$body.style.display = ''
      this.style.top = this._restoreSize.top
      this.style.left = this._restoreSize.left
      this.style.width = this._restoreSize.width
      this.style.height = this._restoreSize.height
      this._restoreSize = null
    }
  }

  connectedCallback() {
    setRole(this, 'window')

    // 将 tabindex 设置在 host 上，
    // 因为 tabindex 在 layout 上的话，鼠标点击 slot 里面的内容时会反复 blur
    this.setAttribute('tabindex', '-1')

    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    // 拖拽 header 移动
    {
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
