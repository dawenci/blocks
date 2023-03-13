import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { selectedSetter } from '../../common/propertyAccessor.js'
import { Component } from '../Component.js'
import { template } from './option.template.js'
import { style } from './option.style.js'

@defineClass({
  customElement: 'bl-option',
  styles: [style],
})
export class BlocksOption extends Component {
  @attr('string') accessor value!: string | null

  @attr('string', {
    defaults: (self: BlocksOption) => {
      return self.textContent || String(self.value)
    },
  })
  accessor label!: string | null

  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor selected!: boolean

  #silentFlag?: boolean

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!

    const fragment = template().cloneNode(true)
    shadowRoot.appendChild(fragment)
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

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
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
}
