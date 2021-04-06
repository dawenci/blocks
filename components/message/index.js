import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter } from '../../common/property.js'
import { __color_primary, __color_danger, __color_success, __color_warning, __transition_duration, __fg_base, __dark_bg_base, __dark_fg_base, __bg_base, __radius_base } from '../../theme/var.js'

const closeableGetter = boolGetter('closeable')
const closeableSetter = boolSetter('closeable')
const typeGetter = enumGetter('type', ['message', 'success', 'error', 'info', 'warning'])
const typeSetter = enumSetter('type', ['message', 'success', 'error', 'info', 'warning'])
const durationGetter = intGetter('duration', 10)
const durationSetter = intSetter('duration')

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  margin: 8px 28px;
  box-shadow: 0 0 5px -2px rgb(0,0,0,0.16),
    0 0 16px 0 rgb(0,0,0,0.08),
    0 0 28px 8px rgb(0,0,0,0.05);
  transition: all var(--transition-duration, ${__transition_duration}) ease-out;
  border-radius: var(--radius-base, ${__radius_base});
  pointer-events: auto;
  background-color: var(--bg-base, ${__bg_base});
  color: var(--fg-base, ${__fg_base});
}
#layout {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;  
  width: 100%;
  padding: 12px;
  position: relative;
}
#icon {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  margin: 0 8px 0 0;
}
#icon:empty {
  display: none;
}
#main {
  flex: 1 1 100%;
}
#title {
  font-size: 16px;
  margin: 2px 0 4px;
}
#title:empty {
  display: none;
}
::slotted(h1) {
  margin: 0;
  font-size: 16px;
}
#content {
  line-height: 24px;
  font-size: 14px;
}
#close {
  flex: 0 0 auto;
  display: block;
  width: 18px;
  height: 18px;
  margin: 3px 0 0 12px;
  padding: 0;
  border: 0 none;
  background: transparent;
  fill: #aaa;
}
#close:hover {
  fill: #888;
}
#close:focus {
  outline: 0 none;
}
#close svg {
  width: 100%;
  height: 100%;
}

:host([type="success"]) {
  background-color: var(--color-success, ${__color_success});
  color: #fff;
  fill: #fff;
}
:host([type="error"]) {
  background-color: var(--color-danger, ${__color_danger});
  color: #fff;
  fill: #fff;
}
:host([type="warning"]) {
  background-color: var(--color-warning, ${__color_warning});
  color: #fff;
  fill: #fff;
}
:host([type="info"]) {
  background-color: var(--color-primary, ${__color_primary});
  color: #fff;
  fill: #fff;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <div id="icon"></div>
  <div id="main">
    <div id="content">
      <slot></slot>
    </div>
  </div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksMessage extends HTMLElement {
  static get observedAttributes() {
    return ['closeable', 'duration', 'type']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.querySelector('#layout')
    this.$icon = shadowRoot.querySelector('#icon')
    this.$content = shadowRoot.querySelector('#content')

    this.$layout.onmouseenter = () => {
      this._clearAutoClose()
    }

    this.$layout.onmouseleave = () => {
      this._setAutoClose()
    }
  }

  get closeable() {
    return closeableGetter(this)
  }

  set closeable(value) {
    closeableSetter(this, value)
  }

  get type() {
    return typeGetter(this)
  }

  set type(value) {
    typeSetter(this, value)
  }

  get duration() {
    return durationGetter(this)
  }

  set duration(value) {
    durationSetter(this, value)
  }

  close() {
    this.ontransitionend = e => {
      if (e.propertyName === 'opacity' && e.target === this) {
        dispatchEvent(this, 'closed')
        this.destroy()
      }
    }
    if (this.parentElement.className.includes('bottom')) {
      this.style.cssText = `transform:translate(0,100%);opacity:0`
    }
    else {
      this.style.cssText = `transform:translate(0,-100%);opacity:0`
    }
  }

  render() {
    const iconName = this.type === 'warning' ? 'info' : this.type
    const icon = getRegisteredSvgIcon(iconName)
    if (icon) {
      this.$icon.innerHTML = ''
      this.$icon.appendChild(icon)
    }

    if (this.closeable) {
      if (!this.$close) {
        this.$close = this.$layout.appendChild(document.createElement('button'))
        this.$close.id = 'close'
        this.$close.appendChild(getRegisteredSvgIcon('cross'))
        this.$close.onclick = () => {
          this.close()
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

  destroy() {
    this._clearAutoClose()
    this.parentElement.removeChild(this)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
    this._setAutoClose()
  }

  disconnectedCallback() { }

  adoptedCallback() { }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()

    if (attrName === 'duration' && this.duration) {
      this._setAutoClose()
    }
  }

  _clearAutoClose() {
    clearTimeout(this._autoCloseTimer)
  }

  _setAutoClose() {
    if (this.duration && this.duration > 0) {
      this._clearAutoClose()
      this._autoCloseTimer = setTimeout(() => {
        this.close()
      }, this.duration * 1000)
    }
  }
}

if (!customElements.get('bl-message')) {
  customElements.define('bl-message', BlocksMessage)
}


function cage() {
  let cage = document.querySelector('.bl-message-cage')
  if (!cage) {
    cage = document.body.appendChild(document.createElement('div'))
    cage.className = `bl-message-cage`
    let cssText = "pointer-events:none;overflow:hidden;position:fixed;z-index:100;top:0;bottom:auto;left:0;right:0;display:flex;flex-flow:column nowrap;justify-content:center;align-items:center;padding:8px 0;"
    cage.style.cssText = cssText
  }
  return cage
}

export function blMessage(options = {}) {
  const el = document.createElement('bl-message')
  typeSetter(el, options.type)
  closeableSetter(el, options.closeable ?? false)
  if (options.duration != null) durationSetter(el, options.duration)

  let content = options.content

  el.innerHTML = content  
  el.style.cssText = `transform:translate(0, -100%);opacity:0;`

  cage().appendChild(el)

  el.offsetHeight
  el.style.cssText = `transform:translate(0, 0);opacity:1;`

  let closedCallback
  let closed = false
  const onClosed = e => {
    closed = true
    if (closedCallback) closedCallback()
    el.removeEventListener('closed', onClosed)
  }
  el.addEventListener('closed', onClosed)

  return {
    el,
    close() {
      el.close()
      return this
    },
    onclose(callback) {
      if (closed) {
        callback()
      }
      else {
        closedCallback = callback
      }
      return this
    }
  }
}
