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
  margin: 8px 28px;
  background: #fff;
  box-shadow: 0 0 5px -2px rgb(0,0,0,0.16),
    0 0 16px 0 rgb(0,0,0,0.08),
    0 0 28px 8px rgb(0,0,0,0.05);
  transition: all ${$transitionDuration} ease-out;
  pointer-events: auto;
}
#layout {
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
  margin: 0 12px 0 0;
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
  margin: 0 0 0 12px;
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
<div id="layout">
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
    if (this.parentElement.className.includes('bottom')) {
      this.style.cssText = `transform:translate(0,100%);opacity:0`
    }
    else {
      this.style.cssText = `transform:translate(0,-100%);opacity:0`
    }
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
      this.$icon.innerHTML = ''
      this.$icon.appendChild(icon)
    }

    if (this.closeable) {
      if (!this._close) {
        this._close = this.$layout.appendChild(document.createElement('button'))
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

  disconnectedCallback() { }

  adoptedCallback() { }

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

const placementEnum = ['top-right', 'bottom-right', 'bottom-left', 'top-left']
const normalizePlacement = (value) => placementEnum.includes(value) ? value : placementEnum[0]

function cage(placement) {
  placement = normalizePlacement(placement)
  let cage = document.querySelector('.blocks-notification-cage' + '.' + placement)
  if (!cage) {
    cage = document.body.appendChild(document.createElement('div'))
    cage.className = `blocks-notification-cage ${placement}`
    let cssText = "pointer-events:none;overflow:hidden;position:fixed;z-index:100;display:flex;flex-flow:column nowrap;padding:8px 0;"

    switch (placement) {
      case 'top-right': {
        cssText += "top:0;right:0;bottom:0;left:auto;justify-content:flex-start;"
        break
      }
      case 'bottom-right': {
        cssText += "top:0;right:0;bottom:0;left:auto;justify-content:flex-end;"
        break
      }
      case 'bottom-left': {
        cssText += "top:0;right:auto;bottom:0;left:0;justify-content:flex-end;"
        break
      }
      case 'top-left': {
        cssText += "top:0;right:auto;bottom:0;left:0;justify-content:flex-start;"
        break
      }
    }

    cage.style.cssText = cssText
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
    content = `<h1 slot="title">${options.title}</h1>` + (content ?? '')
  }

  el.innerHTML = content

  const placement = normalizePlacement(options.placement)
  const parent = cage(placement)

  if (placement.endsWith('right')) {
    el.style.cssText = `transform:translate(100%, 0);opacity:0;`
  }
  else {
    el.style.cssText = `transform:translate(-100%, 0);opacity:0;`
  }

  if (placement.startsWith('top')) {
    parent.appendChild(el)
  }
  else {
    if (parent.firstElementChild) {
      parent.insertBefore(el, parent.firstElementChild)
    }
    else {
      parent.appendChild(el)
    }
  }
  
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
