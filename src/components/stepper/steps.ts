import { attr, attrs } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './steps.style.js'
import { template } from './steps.template.js'
import { BlStep } from './step.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-stepper',
  styles: [style],
})
export class BlSteps extends BlComponent {
  @attr('enum', { enumValues: ['horizontal', 'vertical'] })
  accessor direction!:  MaybeOneOf<['horizontal', 'vertical']>

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @shadowRef('#layout') accessor $layout!: HTMLElement

  @shadowRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupSlot()
    this.#setupAria()

    this.hook.onConnected(this.render)
  }

  #setupSlot() {
    const update = () => {
      this.$slot.assignedElements().forEach($step => {
        if ($step instanceof BlStep) {
          $step.direction = this.direction
          $step.size = this.size
        }
      })
    }
    this.$slot.addEventListener('slotchange', update)
    this.hook.onRender(update)
    this.hook.onAttributeChangedDeps(['direction', 'size'], update)
  }

  stepIndex($step: HTMLElement) {
    return this.$slot.assignedElements().findIndex($el => $el === $step)
  }

  #setupAria() {
    const update = () => {
      this.setAttribute('aria-orientation', this.direction ?? 'horizontal')
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDep('direction', update)
  }
}
