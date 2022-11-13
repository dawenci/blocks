import { strGetter, strSetter } from '../../common/property.js'
import {
  disabledGetter,
  disabledSetter,
  selectedGetter,
  selectedSetter,
} from '../../common/propertyAccessor.js'
import { Component } from '../Component.js'
import { template } from './option-template.js'

export class BlocksOption extends Component {
  #silentFlag?: boolean

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const fragment = template().content.cloneNode(true)
    shadowRoot.appendChild(fragment)
  }

  get value() {
    return strGetter('value')(this)
  }

  set value(value) {
    strSetter('value')(this, value)
  }

  get label() {
    return strGetter('label')(this) ?? (this.textContent || String(this.value))
  }

  set label(value) {
    strSetter('label')(this, value)
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

  silentSelected(value: boolean) {
    this.#silentFlag = true
    selectedSetter(this, value)
    this.#silentFlag = false
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'selected' && newValue !== oldValue) {
      const eventType = newValue === null ? 'deselect' : 'select'
      if (!this.#silentFlag) {
        this.dispatchEvent(
          new CustomEvent(eventType, {
            bubbles: true,
            cancelable: true,
            composed: true,
          })
        )
      }
    }
    this.render()
  }

  static override get observedAttributes() {
    return ['value', 'disabled', 'selected', 'label']
  }
}

if (!customElements.get('bl-option')) {
  customElements.define('bl-option', BlocksOption)
}
