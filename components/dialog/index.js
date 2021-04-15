import BlocksTransitionOpenZoom from '../transition-open-zoom/index.js'
import '../button/index.js'
import '../modal-mask/index.js'
import {
  __bg_base,
  __dark_bg_base,
  __fg_base,
  __dark_fg_base,
  __font_family,
  __radius_base,
  __transition_duration,
  __z_index_dialog_base,
  __z_index_dialog_focus,
} from '../../theme/var.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { setRole } from '../../common/accessibility.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { closeableGetter, closeableSetter } from '../../common/propertyAccessor.js'
import { onDragMove } from '../../common/onDragMove.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: none;
  font-family: var(--font-family, ${__font_family});
  position:absolute;
  margin:auto;
}

:host {
  z-index: var(--z-index, var(--z-index-dialog-base, ${__z_index_dialog_base}));
}

:host(:focus-within) {
  z-index: var(--z-index-focus, var(--z-index-dialog-focus, ${__z_index_dialog_focus}));
}

:host([open]) {
  display: block;
}

:host(:focus) {
  outline: 0 none;
}

/* 对话框 */
#layout {
  position:relative;
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
  background-color: var(--bg-base-dark, ${__dark_bg_base});
  color: var(--fg-base-dark, ${__dark_fg_base});
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

class BlocksDialog extends BlocksTransitionOpenZoom {
  static get observedAttributes() {
    return super.observedAttributes.concat([
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
    ])
  }

  constructor() {
    super()
    // const shadowRoot = this.attachShadow({ mode: 'open' })

    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.$layout = this.shadowRoot.getElementById('layout')
    this.$mask = document.createElement('bl-modal-mask')

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

    this.addEventListener('opened', () => {
      this._focus()
    })

    this.addEventListener('closed', () => {
      this._blur()
      if (this.remove) {
        this.parentElement && this.parentElement.removeChild(this)
      }
    })

    this.$layout.addEventListener('slotchange', e => {
      this.render()
    })

    if (this.capturefocus) {
      this._captureFocus()
    }
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
      if (!this.style.left) {
        this.style.left = (document.body.clientWidth - this.offsetWidth) / 2 + 'px'
      }
      if (!this.style.top) {
        this.style.top = (document.body.clientHeight - this.offsetHeight) / 2 + 'px'
      }
      if (this.$mask) this.$mask.open = true
    }
    else {
      if (this.$mask) this.$mask.open = false
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

    this._initDragEvents()
  }

  _initDragEvents() {
    // 拖拽 header 移动
    let startX
    let startY

    const isHeader = (target) => {
      if (this.$layout.querySelector('header').contains(target)) return true
      // maybe header slot
      if (this.contains(target)) {
        let el = target
        while (el && el !== this) {
          if (el.slot === 'header') return true
          el = el.parentElement
        }
      }
      return false
    }

    onDragMove(this.$layout, {
      onStart: ({ $target, stop }) => {
        if (!isHeader($target)) return stop()
        const marginLeft = parseFloat(window.getComputedStyle(this).marginLeft || '0')
        const marginTop = parseFloat(window.getComputedStyle(this).marginTop || '0')
        startX = this.offsetLeft - marginLeft
        startY = this.offsetTop - marginTop
      },

      onMove: ({ offset }) => {
        this.style.left = startX + offset.x + 'px'
        this.style.top = startY + offset.y + 'px'
      },
    })
  }

  disconnectedCallback() {
    if (this.$mask && this.$mask.parentElement) {
      this.$mask.parentElement.removeChild(this.$mask)
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue)
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
