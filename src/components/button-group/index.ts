import '../button/index.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-button-group',
  styles: [style],
})
export class BlocksButtonGroup extends Component {
  @shadowRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupChildren()
  }

  #setupChildren() {
    const updateChildren = () => {
      this.$slot.assignedElements().forEach($item => {
        if ($item.tagName === 'BL-BUTTON') {
          $item.setAttribute('group-context', '')
        }
      })
    }
    this.$slot.addEventListener('slotchange', updateChildren)
    this.onConnected(updateChildren)
  }
}
