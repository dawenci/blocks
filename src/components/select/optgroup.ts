import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { Component } from '../Component.js'
import { template } from './optgroup.template.js'
import { style } from './option.style.js'

@defineClass({
  customElement: 'bl-optgroup',
  styles: [style],
})
export class BlocksOptGroup extends Component {
  @attr('string') accessor label!: string

  @attr('boolean') accessor disabled!: boolean

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())
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
