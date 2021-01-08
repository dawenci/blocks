const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    white-space: nowrap;
  }
  </style>
  <slot></slot>
`

class BlocksButtonGroup extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
  }
}

if (!customElements.get('blocks-button-group')) {
  customElements.define('blocks-button-group', BlocksButtonGroup)
}
