import { strGetter, strSetter } from '../../common/property.js'
import {
  disabledGetter,
  disabledSetter,
} from '../../common/propertyAccessor.js'
import { Component } from '../Component.js'
import { template } from './optgroup-template.js'

export class BlocksOptGroup extends Component {
  static override get observedAttributes() {
    return ['disabled', 'label']
  }

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const fragment = template().content.cloneNode(true)
    shadowRoot.appendChild(fragment)
  }

  get label() {
    return strGetter('label')(this)
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

  override render() {
    const labelEl = this.shadowRoot!.querySelector('header')!
    if (this.label) {
      labelEl.style.display = ''
      labelEl.textContent = this.label
    } else {
      labelEl.style.display = 'none'
    }
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
    this.render()
  }
}

if (!customElements.get('bl-optgroup')) {
  customElements.define('bl-optgroup', BlocksOptGroup)
}
