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

class BlocksOptGroup extends HTMLElement {
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
    return this.hasAttribute('disabled')
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    }
    else {
      this.setAttribute('disabled', '')
    }
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
      this._upgradeProperty(attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop]
      delete this[prop]
      this[prop] = value
    }
  }
}

if (!customElements.get('blocks-optgroup')) {
  customElements.define('blocks-optgroup', BlocksOptGroup)
}
