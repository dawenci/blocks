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
  __dark_bg_base_header,
} from '../theme/var.js'
import { boolGetter, boolSetter, strGetter, strSetter } from '../../common/property.js'
import { setRole } from '../../common/accessibility.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { openGetter, openSetter } from '../../common/propertyAccessor.js'
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js'
import { initOpenCloseAnimation } from '../../common/initOpenCloseAnimation.js'
import { sizeObserve } from '../../common/sizeObserve.js'

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
  min-width: 200px;
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
  padding: 0;
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
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  flex: 1 1 auto;
}
#body.has-status-bar {
  padding-bottom: 24px;
}
#body.has-status-bar #status-bar {
  display: flex;
}

#content {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
}

/* 状态栏 */
#status-bar {
  display: none;
  flex-flow: row nowrap;
  align-items: center;
  box-sizing: border-box;
  position: absolute;
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  border-top: 1px solid rgba(0, 0, 0, .03);
  background-color: rgba(0, 0, 0, .025);
}

#icon:empty {
  display: none;
}
#icon {
  flex: 0 0 auto;
  height: 14px;
  margin-left: 8px;
}
#icon svg,
#icon img {
  width: 14px;
  height: 14px;
}

#name {
  overflow: hidden;
  box-sizing: border-box;
  flex: 1 1 auto;
  padding: 0 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
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
#maximize:hover,
#minimize:focus,
#maximize:focus {
  background: rgba(0, 0, 0, .05);
}
#close:hover,
#close:focus {
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
  user-select: none;
}
#resize-top,
#resize-right,
#resize-bottom,
#resize-left {
  position: absolute;
  z-index: 1;
  user-select: none;
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

#first, #last, #first:focus, #last:focus {
  overflow: hidden;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0 none;
}

:host([dark]) {
  color: var(--fg-base-dark, ${__dark_fg_base});
  fill: var(--fg-base-dark, ${__dark_fg_base});
}
:host([dark]) #body-bg {
  background-color: var(--bg-base-dark, ${__dark_bg_base});
}
:host([dark]) #header-bg {
  background-color: var(--dark-bg-base-header, ${__dark_bg_base_header});
}
</style>
`
const TEMPLATE_HTML = `
<div id="layout">
  <div id="header-bg"></div>
  <div id="body-bg"></div>

  <header id="header">
    <div id="icon"></div>
    <div id="name"></div>
  </header>

  <section id="body">
    <div id="content">
      <slot></slot>
    </div>
    <footer id="status-bar">
      <slot name="status-bar"></slot>
    </footer>
  </section>

  <b id="resize-top"></b>
  <b id="resize-left"></b>
  <b id="resize-right"></b>
  <b id="resize-bottom"></b>
  <b id="resize-top-left"></b>
  <b id="resize-top-right"></b>
  <b id="resize-bottom-right"></b>
  <b id="resize-bottom-left"></b>

  <div id="actions">
    <button id="minimize"></button>
    <button id="maximize"></button>
    <button id="close"><bl-icon value="cross"></bl-icon></button>
  </div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

const capturefocusGetter = boolGetter('capturefocus')
const capturefocusSetter = boolSetter('capturefocus')

class BlocksWindow extends HTMLElement {
  static get observedAttributes() {
    return [
      // 窗口按钮，'minimize,maximize,close'
      'actions',
      // 捕获焦点，tab 键不会将焦点移出 Dialog
      'capturefocus',
      'dark',
      // 标题图标
      'icon',
      'maximized',
      'minimized',
      // 标题
      'name',
      // 显示状态
      'open',
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$header = shadowRoot.getElementById('header')
    this.$body = shadowRoot.getElementById('body')
    this.$content = shadowRoot.getElementById('content')
    this.$statusBar = shadowRoot.getElementById('status-bar')
    this.$statusBarSlot = shadowRoot.querySelector('[name=status-bar]')
    this.$actions = shadowRoot.getElementById('actions')
    this.$closeButton = shadowRoot.getElementById('close')
    this.$maximizeButton = shadowRoot.getElementById('maximize')
    this.$minimizeButton = shadowRoot.getElementById('minimize')
    this.$icon = shadowRoot.getElementById('icon')
    this.$name = shadowRoot.getElementById('name')

    sizeObserve(this, (data) => {
      if (typeof this.onResize === 'function') {
        this.onResize(data)
      }
      dispatchEvent(this, 'resize', { detail: { data } })
    })

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

    // 主内容变化
    this.$content.addEventListener('slotchange', e => {
      this.render()
    })

    // 状态栏内容变化
    const updateSlot = () => {
      this.$body.classList.toggle('has-status-bar', this.$statusBarSlot.assignedNodes().length)
    }
    updateSlot()
    this.$statusBarSlot.addEventListener('slotchange', e => {
      updateSlot()
    })

    if (this.capturefocus) {
      this._captureFocus()
    }

    this._initMoveEvents()
    this._initResizeEvents()
  }

  get actions() {
    return strGetter('actions')(this) ?? 'minimize,maximize,close'
  }

  set actions(value) {
    if (value !== null && typeof value !== 'string') return
    if (typeof value === 'string') {
      value = value.split(',')
        .filter(action => ['minimize', 'maximize', 'close'].includes(action.trim()))
        .join(',') || null
    }
    strSetter('actions')(this, value)
  }

  get capturefocus() {
    return capturefocusGetter(this)
  }

  set capturefocus(value) {
    capturefocusSetter(this, value)
  }

  get icon() {
    return strGetter('icon')(this)
  }

  set icon(value) {
    strSetter('icon')(this, value)
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

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'actions') {
      this._renderActions()
    }
    if (name === 'capturefocus') {
      if (this.capturefocus) {
        this._captureFocus()
      }
      else {
        this._stopCaptureFocus()
      }
    }
    if (name === 'icon') {
      this._renderIcon()
    }
    if (name === 'name') {
      this._renderName()
    }
    if (name == 'open') {
      this._updateVisible()
    }
  }

  _initMoveEvents() {
    // 拖拽 header 移动
    let startLeft
    let startTop
    let startMouseX
    let startMouseY

    const move = (e) => {
      this.style.left = startLeft + (e.pageX - startMouseX) + 'px'
      this.style.top = startTop + (e.pageY - startMouseY) + 'px'
    }

    const up = () => {
      removeEventListener('mousemove', move)
      removeEventListener('mouseup', up)
    }

    this.$header.onmousedown = (e) => {
      if (this.maximized) return
      const style = getComputedStyle(this)
      startLeft = parseFloat(style.left)
      startTop = parseFloat(style.top)
      startMouseX = e.pageX
      startMouseY = e.pageY
      addEventListener('mousemove', move)
      addEventListener('mouseup', up)
    }
  }

  _initResizeEvents() {
    // 拖拽 header 移动
    let startLeft
    let startTop
    let startWidth
    let startHeight
    let startMouseX
    let startMouseY
    let currentLeft
    let currentTop
    let currentWidth
    let currentHeight
    let updateFn

    const callAll = (...fns) => (...args) => fns.forEach(fn => fn(...args))

    const move = (e) => {
      if (e.pageY > window.innerHeight || e.pageX > window.innerWidth) return
      updateFn(e.pageX, e.pageY)
    }

    const up = () => {
      removeEventListener('mousemove', move)
      removeEventListener('mouseup', up)
    }

    const resizeTop = (x, y) => {
      // offset > 0:  往下拖拽缩小窗口, top 增加，height 减少
      // offset < 0: 往上拖拽放大窗口, top 减少，height 增加
      const offset = y - startMouseY
      const newTop = startTop + offset
      const newHeight= startHeight - offset
      if (newTop < 0 || newHeight < this.$header.offsetHeight) return
      currentTop = newTop
      currentHeight = newHeight
      this.style.top = newTop + 'px'
      this.style.height = newHeight + 'px'
    }
    const resizeBottom = (x, y) => {
      // offset > 0:  往下拖拽放大窗口, height 增加
      // offset < 0: 往上拖拽缩小窗口, height 减少
      const offset = y - startMouseY
      const newHeight= startHeight + offset
      if (newHeight < this.$header.offsetHeight) return
      currentHeight = newHeight
      this.style.height = newHeight + 'px'
    }
    const resizeLeft = (x, y) => {
      // offset > 0:  往右拖拽缩小窗口, left 增加，width 减少
      // offset < 0: 往左拖拽放大窗口, left 减少，width 增加
      const offset = x - startMouseX
      const newLeft = startLeft + offset
      const newWidth= startWidth - offset
      if (newLeft < 0 || newWidth < 200) return
      currentLeft = newLeft
      currentWidth = newWidth
      this.style.left = newLeft + 'px'
      this.style.width = newWidth + 'px'
    }
    const resizeRight = (x, y) => {
      // offset > 0:  往右拖拽放大窗口, width 增加
      // offset < 0: 往左拖拽缩小窗口, width 减少
      const offset = x - startMouseX
      const newWidth= startWidth + offset
      if (newWidth < 200) return
      currentWidth = newWidth
      this.style.width = newWidth + 'px'
    }

    this.$layout.onmousedown = e => {
      if (this.maximized || this.minimized) return
      const $target = e.target
      if ($target.tagName !== 'B') return
      const style = getComputedStyle(this)
      currentLeft = startLeft = parseFloat(style.left)
      currentTop = startTop = parseFloat(style.top)
      currentWidth = startWidth = parseFloat(style.width)
      currentHeight = startHeight = parseFloat(style.height)
      startMouseX = e.pageX
      startMouseY = e.pageY
      switch ($target.id) {
        case 'resize-top': {
          updateFn = resizeTop
          break
        }
        case 'resize-right': {
          updateFn = resizeRight
          break
        }
        case 'resize-bottom': {
          updateFn = resizeBottom
          break
        }
        case 'resize-left': {
          updateFn = resizeLeft
          break
        }
        case 'resize-top-left': {
          updateFn = callAll(resizeTop, resizeLeft)
          break
        }
        case 'resize-top-right': {
          updateFn = callAll(resizeTop, resizeRight)
          break
        }
        case 'resize-bottom-right': {
          updateFn = callAll(resizeBottom, resizeRight)
          break
        }
        case 'resize-bottom-left': {
          updateFn = callAll(resizeBottom, resizeLeft)
          break
        }
      }
      addEventListener('mousemove', move)
      addEventListener('mouseup', up)
    }
  }

  _renderName() {
    this.$name.title = this.$name.textContent = this.name ?? ''
  }

  _renderActions() {
    this.$minimizeButton.style.display = this.actions.includes('minimize') ? '' : 'none'
    this.$maximizeButton.style.display = this.actions.includes('maximize') ? '' : 'none'
    this.$closeButton.style.display = this.actions.includes('close') ? '' : 'none'
  }

  _renderIcon() {
    if (this.$icon.childElementCount) {
      const $icon = this.$icon.firstElementChild
      if ($icon.dataset.name === this.icon) return
    }

    const $icon = getRegisteredSvgIcon(this.icon ?? '')
    if ($icon) {
      $icon.dataset.name = this.icon
      this.$icon.innerHTML = ''
      this.$icon.appendChild($icon)
    }
    else {
      this.$icon.innerHTML = ''
    }
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
