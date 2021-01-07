import {
  $colorPrimary, $colorPrimaryLight,
} from '../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  box-sizing: border-box;
  line-height: 1.5;
  padding: 4px 10px;
  cursor: default;
  font-size: 12px;
}
:host-context(blocks-optgroup) {
  padding: 4px 10px 4px 2em;
}
:host(:focus) {
  outline: 0 none;
}
:host([selected]) {
  background-color: ${$colorPrimary};
  color: #fff;
}
:host([selected]:hover) {
  background-color: ${$colorPrimaryLight};
  color: #fff;
}
:host-context(blocks-optgroup[disabled]),
:host([disabled]) {
  color: #ccc;
  cursor: not-allowed;
}
:host(:hover) {
  background-color: #f0f0f0;
}
:host-context(blocks-optgroup[disabled]:hover),
:host([disabled]:hover) {
  background-color: transparent;
}
</style>`

const TEMPLATE_HTML = `<slot></slot>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksOption extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
      'disabled',
      'selected',
      'label',
    ]
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const fragment = template.content.cloneNode(true)
    this.shadowRoot.appendChild(fragment)
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(value) {
    this.setAttribute('value', value)
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

  get selected() {
    return this.hasAttribute('selected')
  }

  set selected(value) {
    if (value === null || value === false) {
      this.removeAttribute('selected')
    }
    else {
      this.setAttribute('selected', '')
    }
    this.dispatchEvent(new CustomEvent('select', { bubbles: true, cancelable: true, composed: true }))
  }

  render() {
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

if (!customElements.get('blocks-option')) {
  customElements.define('blocks-option', BlocksOption)
}
