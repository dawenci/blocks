import { } from '../../theme/var.js'

import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  overflow: hidden;
  user-select: none;
  cursor: default;
  width: 32px;
  height: 32px;
}
:host(:focus) {
  outline: 0 none;
}
#layout {
  width: 100%;
  height: 100%;
}
#layout svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>`

const TEMPLATE_HTML = `<div id="layout"></div>`

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
    this.$layout = fragment.querySelector('#layout')
    this.shadowRoot.appendChild(fragment)
  }

  render() {
    if (this.$layout.firstElementChild) this.$layout.removeChild(this.$layout.firstElementChild)
    const attrs = {}
    if (this.fill) attrs.fill = this.fill
    let icon = getRegisteredSvgIcon(this.value, attrs) ?? parseSvg(this.value, attrs)
    if (icon) this.$layout.appendChild(icon)
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

if (!customElements.get('bl-icon')) {
  customElements.define('bl-icon', BlocksIcon)
}
