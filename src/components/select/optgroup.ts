import { Component } from '../Component.js'
import { template } from './optgroup-template.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

@customElement('bl-optgroup')
export class BlocksOptGroup extends Component {
  static override get observedAttributes() {
    return ['disabled', 'label']
  }

  @attr('string') accessor label!: string

  @attr('boolean') accessor disabled!: boolean

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const fragment = template().content.cloneNode(true)
    shadowRoot.appendChild(fragment)
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
