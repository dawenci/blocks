import './menu-item.js'
import './menu-group.js'
import './submenu.js'

import { __color_primary, __fg_secondary, __font_family } from '../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
}
</style>`
const TEMPLATE_HTML = `<slot></slot>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksSubmenu extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
  }
}

if (!customElements.get('blocks-submenu')) {
  customElements.define('blocks-submenu', BlocksSubmenu)
}
