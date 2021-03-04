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

const itemTemplate = document.createElement('blocks-nav-menu-item')
const groupTemplate = document.createElement('blocks-nav-menu-group')

class BlocksNavSubmenu extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  get data() {
    return this._data
  }

  set data(value) {
    this._data = value
    this.render()
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
    const fragment = document.createDocumentFragment()
    this.data.forEach(item => {
      // group
      if (item.data) {
        const $group = fragment.appendChild(groupTemplate.cloneNode(true))
        $group.horizontal = this.horizontal
        $group.collapse = this.collapse
        $group.$hostMenu = this
        $group.rootContext = this.rootContext
        $group.data = item
        return
      }
      // item
      const $item = fragment.appendChild(itemTemplate.cloneNode(true))
      $item.$hostMenu = this
      $item.rootContext = this.rootContext
      $item.data = item
    })
    this.innerHTML = ''
    this.appendChild(fragment)
  }
}

if (!customElements.get('blocks-nav-submenu')) {
  customElements.define('blocks-nav-submenu', BlocksNavSubmenu)
}
