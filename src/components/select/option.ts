import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { selectedSetter } from '../../common/propertyAccessor.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-option',
})
export class BlOption extends BlComponent {
  static override get role() {
    return 'option'
  }

  @attr('string') accessor value!: string | null

  @attr('string', {
    defaults: (self: BlOption) => {
      return self.textContent || String(self.value)
    },
  })
  accessor label!: string | null

  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor selected!: boolean

  #silentFlag?: boolean

  constructor() {
    super()

    this.hook.onAttributeChangedDep('selected', (_, oldValue, newValue) => {
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
    this.withBlSilent(() => {
      this.#silentFlag = true
      selectedSetter(this, value)
      this.#silentFlag = false
    })
  }
}
