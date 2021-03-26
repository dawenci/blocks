import { disabledGetter, disabledSetter, selectedGetter, selectedSetter } from '../../common/propertyAccessor.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { rgbaFromHex } from '../../common/color.js'
import {
  __color_primary, __color_primary_light,
} from '../../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  box-sizing: border-box;
  line-height: 1.5;
  padding: 4px 10px;
  cursor: default;
  font-size: 12px;
}
:host-context(bl-optgroup) {
  padding: 4px 10px 4px 2em;
}
:host(:focus) {
  outline: 1px solid ${rgbaFromHex(__color_primary, .3)};
  background: ${rgbaFromHex(__color_primary, .1)};
}
:host([selected]) {
  background-color: var(--color-primary, ${__color_primary});
  color: #fff;
}
:host([selected]:hover) {
  background-color: var(--color-primary-light, ${__color_primary_light});
  color: #fff;
}
:host-context(bl-optgroup[disabled]),
:host([disabled]) {
  color: #ccc;
  cursor: not-allowed;
}
:host(:hover) {
  background-color: #f0f0f0;
}
:host-context(bl-optgroup[disabled]:hover),
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
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get selected() {
    return selectedGetter(this)
  }

  set selected(value) {
    selectedSetter(this, value)
  }

  silentSelected(value) {
    this._silent = true
    selectedSetter(this, value)
    this._silent = false
  }

  render() {
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
    if (name === 'selected' && newValue !== oldValue) {
      const eventType = newValue === null ? 'deselect' : 'select'
      if (!this._silent) {
        this.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true, composed: true }))
      }
    }
    this.render()
  }
}

if (!customElements.get('bl-option')) {
  customElements.define('bl-option', BlocksOption)
}
