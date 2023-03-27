import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { selectedSetter } from '../../common/propertyAccessor.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-option',
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

    this.onAttributeChangedDep('selected', (_, oldValue, newValue) => {
      if (newValue !== oldValue) {
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
    })
  }

  silentSelected(value: boolean) {
    this.#silentFlag = true
    selectedSetter(this, value)
    this.#silentFlag = false
  }
}
