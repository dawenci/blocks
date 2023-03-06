import { selectedSetter } from '../../common/propertyAccessor.js'
import { Component } from '../Component.js'
import { template } from './option-template.js'
import { customElement } from '../../decorators/customElement.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'

@customElement('bl-option')
export class BlocksOption extends Component {
  static override get observedAttributes() {
    return ['value', 'disabled', 'selected', 'label']
  }

  #silentFlag?: boolean

  @attr('string') accessor value!: string | null

  @attr('string', {
    defaults: (self: BlocksOption) => {
      return self.textContent || String(self.value)
    },
  })
  accessor label!: string | null

  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor selected!: boolean

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const fragment = template().content.cloneNode(true)
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
}
