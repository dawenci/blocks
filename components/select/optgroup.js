import { disabledGetter, disabledSetter } from "../../common/propertyAccessor.js"
import { upgradeProperty } from "../../common/upgradeProperty.js"

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  box-sizing: border-box;
  line-height: 1.5;
  font-size: 14px;
}
:host(:focus) {
  outline: 0 none;
}

.header {
  font-weight: 700;
  padding: 4px 10px;
  cursor: default;
}
</style>`

const TEMPLATE_HTML = `
<header class="header"></header>
<div class="list">
<slot></slot>
</div>
`


const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

export class BlocksOptGroup extends HTMLElement {
  static get observedAttributes() {
    return [
      'disabled',
      'label',
    ]
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const fragment = template.content.cloneNode(true)
    this.shadowRoot.appendChild(fragment)
  }

  get label() {
    return this.getAttribute('label')
  }

  set label(value) {
    this.setAttribute('label', value)
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  render() {
    const labelEl = this.shadowRoot.querySelector('header')
    if (this.label) {
      labelEl.style.display = ''
      labelEl.textContent = this.label
    }
    else {
      labelEl.style.display = 'none'
    }
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

if (!customElements.get('bl-optgroup')) {
  customElements.define('bl-optgroup', BlocksOptGroup)
}
