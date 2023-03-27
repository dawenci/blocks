import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js'
import { attr, attrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './steps.style.js'
import { template } from './steps.template.js'
import { BlocksStep } from './step.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-stepper',
  styles: [style],
})
export class BlocksSteps extends Component {
  @attr('enum', { enumValues: ['horizontal', 'vertical'] })
  accessor direction!: NullableEnumAttr<['horizontal', 'vertical']>

  @attrs.size accessor size!: EnumAttrs['size']

  @shadowRef('#layout') accessor $layout!: HTMLElement

  @shadowRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())

    this.onConnected(this.render)

    this.#setupSlot()
  }

  #setupSlot() {
    const updateItemDirection = () => {
      this.$slot.assignedElements().forEach($step => {
        if ($step instanceof BlocksStep) {
          $step.direction = this.direction
        }
      })
    }
    this.onAttributeChangedDep('direction', updateItemDirection)
    this.onConnected(() => {
      updateItemDirection()
      this.$slot.addEventListener('slotchange', updateItemDirection)
    })
    this.onDisconnected(() => {
      this.$slot.removeEventListener('slotchange', updateItemDirection)
    })
  }

  stepIndex($step: HTMLElement) {
    return this.$slot.assignedElements().findIndex($el => $el === $step)
  }
}
