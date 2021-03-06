import '../icon/index.js'
import '../modal-mask/index.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { openGetter, openSetter } from '../../common/propertyAccessor.js'
import { setStyles } from '../../common/style.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __bg_base, __dark_bg_base, __fg_base, __dark_fg_base, __transition_duration, __z_index_drawer_base, __z_index_drawer_focus } from '../../theme/var.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { onKey } from '../../common/onKey.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'
import { capitalize } from '../../common/utils.js'
import { dispatchEvent } from '../../common/event.js'

const capturefocusGetter = boolGetter('capturefocus')
const capturefocusSetter = boolSetter('capturefocus')
const maskGetter = boolGetter('mask')
const maskSetter = boolSetter('mask')
const placementGetter = enumGetter('placement', ['right', 'left', 'bottom', 'top'])
const placementSetter = enumSetter('placement', ['right', 'left', 'bottom', 'top'])

const TEMPLATE_CSS = `<style>
:host {
  display: none;
  box-sizing: border-box;
  position: fixed;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: var(--bg-base, ${__bg_base});
  color: var(--fg-base, ${__fg_base});
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.1),
    0px 24px 38px 3px rgba(0, 0, 0, 0.10),
    0px 9px 46px 8px rgba(0, 0, 0, 0.10);
  font-size: 14px;
}

:host {
  z-index: var(--z-index, var(--z-index-drawer-base, ${__z_index_drawer_base}));
}
:host(:focus-within) {
  z-index: var(--z-index-focus, var(--z-index-drawer-focus, ${__z_index_drawer_focus}));
}

:host([open]) {
  display: block;
}

#layout {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
}

#header {
  flex: 0 0 44px;
  display: flex;
  flex-flow: row nowrap;
  height: 44px;
}
#body {
  flex: 1 1 auto;
}
#footer {
  flex: 0 0 auto;
}

#name {
  overflow: hidden;
  white-space: nowrap;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 15px;
  font-size: 16px;
}
#name-prop {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#close {
  flex: 0 0 auto;
  margin: 0 10px 0 0;
  padding: 5px;
  border: none;
  border-radius: 50%;
  background: none;
  fill: #aaa;
}
#close:focus {
  outline: none;
}
#close:hover {
  fill: #888;
}
#close:active {
  fill: #666;
}
#close bl-icon {
  width: 14px;
  height: 14px;
  cursor: pointer;
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
  background-color: var(--bg-base-dark, ${__dark_bg_base});
  color: var(--fg-base-dark, ${__dark_fg_base});
}

:host(.openLeft-enter-transition-active),
:host(.openLeft-leave-transition-active),
:host(.openRight-enter-transition-active),
:host(.openRight-leave-transition-active),
:host(.openTop-enter-transition-active),
:host(.openTop-leave-transition-active),
:host(.openBottom-enter-transition-active),
:host(.openBottom-leave-transition-active) {
  display: block;
  transition-delay: 0, 0;
  transition-property: transform;
  transition-duration: var(--transition-duration, ${__transition_duration});
  transition-timing-function: cubic-bezier(.645, .045, .355, 1);
  pointer-events: none;
}

:host(.openLeft-enter-transition-active),
:host(.openLeft-leave-transition-active) {
  transform-origin: left center;
}
:host(.openRight-enter-transition-active),
:host(.openRight-leave-transition-active) {
  transform-origin: right center;
}

:host(.openRight-enter-transition-from),
:host(.openLeft-enter-transition-from) {
  transform: scale(0, 1);
}
:host(.openRight-enter-transition-to) ,
:host(.openLeft-enter-transition-to) {
  transform: scale(1, 1);
}
:host(.openRight-leave-transition-from),
:host(.openLeft-leave-transition-from) {
  transform: scale(1, 1);
}
:host(.openRight-leave-transition-to),
:host(.openLeft-leave-transition-to) {
  transform: scale(0, 1);
}


:host(.openTop-enter-transition-active),
:host(.openTop-leave-transition-active) {
  transform-origin: center top;
}
:host(.openBottom-enter-transition-active),
:host(.openBottom-leave-transition-active) {
  transform-origin: center bottom;
}

:host(.openTop-enter-transition-from),
:host(.openBottom-enter-transition-from) {
  transform: scale(1, 0);
}
:host(.openBottom-enter-transition-to),
:host(.openTop-enter-transition-to) {
  transform: scale(1, 1);
}
:host(.openBottom-leave-transition-from),
:host(.openTop-leave-transition-from) {
  transform: scale(1, 1);
}
:host(.openBottom-leave-transition-to),
:host(.openTop-leave-transition-to) {
  transform: scale(1, 0);
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <header id="header">
    <div id="name">
      <slot name="name">
        <span id="name-prop"></span>
      </slot>
    </div>
    <button id="close">
      <bl-icon value="cross"></bl-icon>
    </button>
  </header>
  <div id="body"><slot></slot></div>
  <footer id="footer"><slot name="footer"></slot></footer>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksDrawer extends HTMLElement {
  static get observedAttributes() {
    return ['capturefocus', 'close-on-click-outside', 'close-on-escape', 'mask', 'name', 'open', 'placement', 'size']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$name = shadowRoot.getElementById('name-prop')
    this.$close = shadowRoot.getElementById('close')
    this.$close.onclick = () => this.open = false

    if (this.capturefocus) {
      this._captureFocus()
    }
  }

  get capturefocus() {
    return capturefocusGetter(this)
  }

  set capturefocus(value) {
    capturefocusSetter(this, value)
  }

  get closeOnClickOutside() {
    return boolGetter('close-on-click-outside')(this)
  }

  set closeOnClickOutside(value) {
    boolSetter('close-on-click-outside')(this, value)
  }

  get closeOnEscape() {
    return boolGetter('close-on-escape')(this)
  }

  set closeOnEscape(value) {
    boolSetter('close-on-escape')(this, value)
  }

  get mask() {
    return maskGetter(this)
  }

  set mask(value) {
    maskSetter(value)
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

  get placement() {
    return placementGetter(this)
  }

  set placement(value) {
    placementSetter(this, value)
  }

  get size() {
    const size = this.getAttribute('size')
    return size || '30%'
  }

  set size(value) {
    return this.setAttribute('size', value)
  }

  render() {
    let top = '0'
    let right = '0'
    let bottom = '0'
    let left = '0'
    switch (this.placement) {
      case 'right': {
        setStyles(this, { top, right, bottom, left: 'auto', height: '100vh', width: this.size })
        break
      }
      case 'left': {
        setStyles(this, { top, right: 'auto', bottom, left, height: '100vh', width: this.size })
        break
      }
      case 'bottom': {
        setStyles(this, { top: 'auto', right, bottom, left, width: '100vw', height: this.size })
        break
      }
      case 'top': {
        setStyles(this, { top, right, bottom: 'auto', left, width: '100vw', height: this.size })
        break
      }
    }

    this.$name.textContent = this.name
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    if (this.parentElement !== document.body) {
      document.body.appendChild(this)
    }

    this.render()

    if (this.mask) {
      this._ensureMask()
      this.parentElement.insertBefore(this.$mask, this)
      this.$mask.open = this.open
    }

    this._initClickOutside()
    this._initKeydown()
  }

  disconnectedCallback() {
    if (this.$mask && document.body.contains(this.$mask)) {
      this.$mask.open = false
      this.$mask.parentElement.removeChild(this.$mask)
    }

    this._destroyClickOutside()
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'open') {
      if (this.$mask) {
        this.$mask.open = this.open
      }
      if (this.open) {
        doTransitionEnter(this, `open${capitalize(this.placement)}`, () => {
          dispatchEvent(this, 'opened')
        })
      }
      else {
        doTransitionLeave(this, `open${capitalize(this.placement)}`, () => {
          dispatchEvent(this, 'closed')
        })
      }
    }

    if (attrName === 'mask' && this.mask && !this.$mask) {
      if (this.mask) {
        this._ensureMask()
        this.parentElement.insertBefore(this.$mask, this)
        this.$mask.open = this.open
      }
      else if (this.$mask && document.body.contains(this.$mask)) {
        this.$mask.open = false
        this.$mask.parentElement.removeChild(this.$mask)
      }
    }

    if (attrName === 'close-on-click-outside') {
      if (this.closeOnClickOutside) {
        this._initClickOutside
      }
      else {
        this._destroyClickOutside()
      }
    }

    if (attrName === 'close-on-escape') {
      if (this.closeOnEscape) {
        this._initKeydown()
      }
      else {
        this._destroyKeydown()
      }
    }

    if (attrName === 'capturefocus') {
      if (this.capturefocus) {
        this._captureFocus()
      }
      else {
        this._stopCaptureFocus()
      }
    }
  }

  _initKeydown() {
    if (this.closeOnEscape && !this._clearKeydown) {
      this._clearKeydown = onKey('escape', () => {
        if (this.open) this.open = false
      })
    }
  }

  _destroyKeydown() {
    if (this._clearKeydown) {
      this._clearKeydown()
      this._clearKeydown = undefined
    }
  }

  _initClickOutside() {
    if (this.closeOnClickOutside && !this._clearClickOutside) {
      this._clearClickOutside = onClickOutside(this, () => {
        if (this.open) this.open = false
      })
    }
  }

  _destroyClickOutside() {
    if (this._clearClickOutside) {
      this._clearClickOutside()
      this._clearClickOutside = undefined
    }
  }

  _ensureMask() {
    if (!this.$mask) {
      this.$mask = document.createElement('bl-modal-mask')
    }
    this.$mask.open = this.open
    return this.$mask
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
}

if (!customElements.get('bl-drawer')) {
  customElements.define('bl-drawer', BlocksDrawer)
}
