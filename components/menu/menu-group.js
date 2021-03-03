import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __color_primary, __fg_secondary, __font_family } from '../theme/var.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: block;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
}
#head {
  margin: 5px 10px;
  padding: 5px;
  border-bottom: 1px solid #eee;
  font-weight: 700;
  color: var(--fg-secondary, ${__fg_secondary});
}
</style>
`
const TEMPLATE_HTML = `<div id="head"></div><div id="body"><slot></slot></div>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksMenuGroup extends HTMLElement {
  static get observedAttributes() {
    return ['title']
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$head = this.shadowRoot.getElementById('head')
    this.$body = this.shadowRoot.getElementById('body')
  }

  get title() {
    return this.getAttribute('title')
  }

  set title(value) {
    this.setAttribute('title', value)
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
    this.$head.innerText = this.title
  }
}

if (!customElements.get('blocks-menu-group')) {
  customElements.define('blocks-menu-group', BlocksMenuGroup)
}
