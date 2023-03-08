import { defineClass } from '../../decorators/defineClass.js'
import { domRef } from '../../decorators/domRef.js'
import { BlocksButton } from '../button/index.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { style } from './style.js'
import '../button/index.js'

@defineClass({
  customElement: 'bl-button-group',
  styles: [style],
})
export class BlocksButtonGroup extends Component {
  @domRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template().content.cloneNode(true))
    this.$slot.addEventListener('slotchange', this.render.bind(this))
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override render() {
    this.$slot.assignedElements().forEach($item => {
      if ($item instanceof BlocksButton) {
        $item.setAttribute('group-context', '')
      }
    })
  }
}
