import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-divider',
})
export class BlDivider extends BlComponent {
  static override get role() {
    return 'separator'
  }

  @attr('boolean') accessor vertical!: boolean

  /** 水平排列方式 */
  @attr('enum', {
    enumValues: ['vertical', 'horizontal'],
    observed: false,
  })
  accessor direction!: MaybeOneOf<['vertical', 'horizontal']>

  @shadowRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.#setupAria()
  }

  #setupAria() {
    const update = () => {
      this.setAttribute('aria-orientation', this.vertical ? 'vertical' : 'horizontal')
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDep('vertical', update)
  }
}
