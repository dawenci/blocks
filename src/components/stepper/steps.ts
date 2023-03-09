import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import { Component } from '../Component.js'
import { template } from './steps.template.js'
import { style } from './steps.style.js'
import { domRef } from '../../decorators/domRef.js'

@defineClass({
  customElement: 'bl-stepper',
  styles: [style],
})
export class BlocksSteps extends Component {
  @attr('enum', { enumValues: ['horizontal', 'vertical'] })
  accessor direction!: NullableEnumAttr<['horizontal', 'vertical']>

  @attrs.size accessor size!: EnumAttrs['size']

  @domRef('#layout') accessor $layout!: HTMLElement

  @domRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  stepIndex($step: HTMLElement) {
    return this.$slot.assignedElements().findIndex($el => $el === $step)
  }
}
