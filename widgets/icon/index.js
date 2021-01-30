import {} from '../theme/var.js'

import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { upgradeProperty } from '../core/upgradeProperty.js'

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host(:focus) {
  outline: 0 none;
}
:host {
  overflow: hidden;
  display: inline-block;
  user-select: none;
  cursor: default;
  width: 32px;
  height: 32px;
}
.widget {
  width: 100%;
  height: 100%;
}
.widget svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>`

const TEMPLATE_HTML = `<div class="widget"></div>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksIcon extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
      'fill',
    ]
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const fragment = template.content.cloneNode(true)
    this._widget = fragment.querySelector('.widget')
    this.shadowRoot.appendChild(fragment)
  }

  render() {
    if (this._widget.firstElementChild) this._widget.removeChild(this._widget.firstElementChild)
    const attrs = {}
    if (this.fill) attrs.fill = this.fill
    let icon = getRegisteredSvgIcon(this.value, attrs) ?? parseSvg(this.value, attrs)
    if (icon) this._widget.appendChild(icon)
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(value) {
    this.setAttribute('value', value)
  }

  get fill() {
    return this.getAttribute('fill')
  }

  set fill(value) {
    return this.setAttribute('fill', value)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }
}

if (!customElements.get('blocks-icon')) {
  customElements.define('blocks-icon', BlocksIcon)
}
