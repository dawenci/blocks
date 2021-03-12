import '../button/index.js'
import {
  __bg_base,
  __bg_baseDark,
  __border_color_base,
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
import { onTransition } from '../../common/onTransition.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: none;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  margin: auto;
  padding: 0;
  font-family: var(--font-family, ${__font_family});
  border: 1px solid var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  background-color: var(--bg-base, ${__bg_base});
  color: var(--fg-base, ${__fg_base});
  pointer-events: none;
  transition: transform var(--transition-duration, ${__transition_duration}) cubic-bezier(.645, .045, .355, 1), opacity var(--transition-duration, ${__transition_duration}) cubic-bezier(.645, .045, .355, 1);
  transform: scale(0);
  opacity: 0;
}
:host([open]) {
  display: block;
  pointer-events: auto;
  opacity: 1;
  transform: scale(1);
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.1);
}

:host(:focus-within) {
  outline: 0 none;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}

:host(:focus) {
  outline: 0 none;
}

:host([dark]) {
  background-color: var(--bg-base-dark, ${__bg_baseDark});
  color: var(--fg-base-dark, ${__fg_baseDark});
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
  flex: 0 0 var(--height-base, ${__height_base});
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  cursor: move;
  user-select: none;
  border-bottom: 1px solid var(--border-color-base, ${__border_color_base});
}

#body {
  flex: 1 1 auto;
}

#footer {
  flex: 0 0 auto;
}
</style>
`
const TEMPLATE_HTML = `
<div id="layout">
  <header id="header">
    <div id="icon"></div>
    <div id="title"></div>
    <div id="actions">
      <button id="maximize"></button>
      <button id="maximize"></button>
      <button id="close"></button>
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
      'title',
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

    this.$closeButton = shadowRoot.getElementById('close')
    this.$maximizeButton = shadowRoot.getElementById('maximize')
    this.$minimizeButton = shadowRoot.getElementById('minimize')

    this.$closeButton.onclick = () => {
      this.open = false
    }

    onTransition(this, {
      start: () => this._disableEvents(),
      end: () => this._onTransitionEnd()
    })

    // 过渡结束
    this._onTransitionEnd = ev => {
      if (ev.target !== this || ev.propertyName !== 'opacity') return
      this._enableEvents()

      if (this.open) {
        this._focus()
        dispatchEvent(this, 'open')
      }
      else {
        this._blur()
        dispatchEvent(this, 'close')
      }
      this.style.display = ''
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

  get title() {
    return this.getAttribute('title')
  }

  set title(value) {
    this.setAttribute('title', value)
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

  // 执行过渡前的准备工作，确保动画正常
  _prepareForAnimateOpen() {
    this.style.display = 'block'
    this.style.opacity = '0'
    this.style.transform = 'scale(0)'
    this.offsetHeight
  }

  // 执行过渡前的准备工作，确保动画正常
  _prepareForAnimateClose() {
    this.style.display = 'block'
    this.style.opacity = '1'
    this.style.transform = 'scale(1)'
    this.offsetHeight
  }

  // 启用鼠标交互
  _enableEvents() {
    this.style.pointerEvents = ''
  }

  // 禁用鼠标交互
  _disableEvents() {
    this.style.pointerEvents = 'none'
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
      this._prepareForAnimateOpen()
      this._lockScroll()
      this._animateOpen()
    }
    else {
      this._prepareForAnimateClose()
      this._unlockScroll()
      this._animateClose()
    }
  }

  _animateOpen() {
    // 强制执行动画
    this.offsetHeight
    this.style.opacity = ''
    this.style.transform = ''

    if (!this.style.left) {
      this.style.left = (document.body.clientWidth - this.$layout.offsetWidth) / 2 + 'px'
    }
    if (!this.style.top) {
      this.style.top = (document.body.clientHeight - this.$layout.offsetHeight) / 2 + 'px'
    }
  }

  _animateClose() {
    // 强制执行动画
    this.offsetHeight
    this.style.display = 'block'
    this.style.opacity = '0'
    this.style.transform = 'scale(0)'
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
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'open') {
      this._updateVisible()
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

if (!customElements.get('bl-window')) {
  customElements.define('bl-window', BlocksWindow)
}
