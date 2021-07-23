import { upgradeProperty } from '../../common/upgradeProperty.js'

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  font-size: 12px;
}
</style>`

const TEMPLATE_HTML = `<slot></slot>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

export class BlocksBreadcrumb extends HTMLElement {
  static get observedAttributes() {
    return ['separator']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$slot = this.shadowRoot.querySelector('slot')

    this.$slot.addEventListener('slotchange', e => {
      this.render()
    })
  }

  get separator() {
    return this.getAttribute('separator') ?? '/'
  }

  set separator(value) {
    this.setAttribute('separator', value)
  }

  render() {
    this.$slot.assignedElements()
      .forEach($item => {
        if ($item.renderSeparator) {
          $item.renderSeparator(this.separator)
        }
      })
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
}

if (!customElements.get('bl-breadcrumb')) {
  customElements.define('bl-breadcrumb', BlocksBreadcrumb)
}
