import { upgradeProperty } from '../../common/upgradeProperty.js'

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
</style>`

const TEMPLATE_HTML = `
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksDatetimePicer extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
  }

  render() {}

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()    
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}
}

if (!customElements.get('blocks-datetime-picker')) {
  customElements.define('blocks-datetime-picker', BlocksDatetimePicker)
}
