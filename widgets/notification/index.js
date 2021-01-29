import { dispatchEvent } from '../core/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter } from '../core/property.js'
import { $colorPrimary, $colorDanger, $colorSuccess, $colorWarning, $transitionDuration } from '../theme/var.js'

const closeableGetter = boolGetter('closeable')
const closeableSetter = boolSetter('closeable')
const typeGetter = enumGetter('type', ['message', 'success', 'error', 'info', 'warning'])
const typeSetter = enumSetter('type', ['message', 'success', 'error', 'info', 'warning'])
const durationGetter = intGetter('duration')
const durationSetter = intSetter('duration')

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  box-sizing: border-box;
  width: 350px;
  margin: 15px 28px;
  background: #fff;
  box-shadow: 0 0 5px -2px rgb(0,0,0,0.16),
    0 0 16px 0 rgb(0,0,0,0.08),
    0 0 28px 8px rgb(0,0,0,0.05);
  transition: all ${$transitionDuration} ease-out;
}
#notification {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;  
  width: 100%;
  padding: 15px;
  position: relative;
}
#icon {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  margin: 0 15px 0 0;
}
#icon:empty {
  display: none;
}
#main {
  flex: 1 1 100%;
}
#title {
  font-size: 16px;
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
#title+#content {
  margin-top: 8px;
}
#close {
  flex: 0 0 auto;
  display: block;
  width: 18px;
  height: 18px;
  margin: 0 0 0 15px;
  padding: 0;
  border: 0 none;
  background: #fff;
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
</style>`

const TEMPLATE_HTML = `
<div id="notification">
  <div id="icon"></div>
  <div id="main">
    <div id="title">
      <slot name="title"></slot>
    </div>
    <div id="content">
      <slot></slot>
    </div>
  </div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksNotification extends HTMLElement {
  static get observedAttributes() {
    return ['type']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this._widget = shadowRoot.querySelector('#notification')
    this._icon = shadowRoot.querySelector('#icon')
    this._content = shadowRoot.querySelector('#content')

    this._widget.onmouseenter = () => {
      this._clearAutoClose()
    }
    this._widget.onmouseleave = () => {
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
    return durationGetter(this) || 10
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
    this.style.cssText = `transform:translate(0,-100%);opacity:0`
  }

  render() {
    const fill = this.type === 'success' ? $colorSuccess
      : this.type === 'error' ? $colorDanger
      : this.type === 'warning' ? $colorWarning
      : this.type === 'info' ? $colorPrimary
      : undefined
    const iconName = this.type === 'warning' ? 'info' : this.type
    const icon = getRegisteredSvgIcon(iconName, { fill })
    if (icon) {
      this._icon.innerHTML = ''
      this._icon.appendChild(icon)
    }

    if (this.closeable) {
      if (!this._close) {
        this._close = this._widget.appendChild(document.createElement('button'))
        this._close.id = 'close'
        this._close.appendChild(getRegisteredSvgIcon('cross'))
        this._close.onclick = () => {
          this.close()
        }
      }
    }
    else {
      if (this._close) {
        this._close.parentElement.removeChild(this._close)
        this._close = null
      }
    }

    this._setAutoClose()
  }

  destroy() {
    this.parentElement.removeChild(this)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
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

if (!customElements.get('blocks-notification')) {
  customElements.define('blocks-notification', BlocksNotification)
}

function cage() {
  let cage = document.querySelector('.blocks-notification-cage')
  if (!cage) {
    cage = document.body.appendChild(document.createElement('div'))
    cage.className = 'blocks-notification-cage'
    cage.style.cssText = "overflow:hidden;position:fixed;z-index:100;top:0;right:0;bottom:0;left:auto;"
  }
  return cage
}

export function notify(options = {}) {
  const el = document.createElement('blocks-notification')
  typeSetter(el, options.type)
  closeableSetter(el, options.closeable ?? false)
  if (options.duration) durationSetter(el, options.duration)

  let content = options.content
  if (options.title) {
    content = `<h1 slot="title">${options.title}</h1>` + content
  }

  el.innerHTML = content

  el.style.cssText = `transform:translate(100%, 0);opacity:0;`

  cage().appendChild(el)
  el.offsetHeight
  el.style.cssText = `transform:translate(0, 0);opacity:1;`

  return el
}
