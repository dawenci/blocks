const template = document.createElement('template')
template.innerHTML = `
  <style>
    ::slotted(blocks-button) {
      position: relative;
    }
    ::slotted(blocks-button:first-of-type) {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    ::slotted(blocks-button:not(:last-of-type)) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-right: -1px;
    }
    ::slotted(blocks-button:not(:last-of-type):hover),
    ::slotted(blocks-button:not(:last-of-type):focus) {
      z-index: 1;
    }
    ::slotted(blocks-button:last-of-type) {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    ::slotted(blocks-button:not(:first-of-type)) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
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
