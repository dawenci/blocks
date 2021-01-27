import { boolGetter, boolSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { makeRgbaColor } from '../core/utils.js'
import {
  $colorPrimary, $colorPrimaryLight,
} from '../theme/var.js'

const selectedGetter = boolGetter('selected')
const selectedSetter = boolSetter('selected')
const disabledGetter = boolGetter('disabled')
const disabledSetter = boolSetter('disabled')

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
  outline: 1px solid ${makeRgbaColor($colorPrimary, .3)};
  background: ${makeRgbaColor($colorPrimary, .1)};
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

if (!customElements.get('blocks-option')) {
  customElements.define('blocks-option', BlocksOption)
}
