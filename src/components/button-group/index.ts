import '../button/index.js'
import { BlocksButton } from '../button/index.js'
import { Component } from '../Component.js'
import { template } from './template.js'

export class BlocksButtonGroup extends Component {
  ref: {
    $slot: HTMLSlotElement
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))
    this.ref = {
      $slot: shadowRoot.querySelector('slot')!,
    }
    this.ref.$slot.addEventListener('slotchange', this.render.bind(this))
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override render() {
    this.ref.$slot.assignedElements().forEach($item => {
      if ($item instanceof BlocksButton) {
        $item.setAttribute('group-context', '')
      }
    })
  }
}

if (!customElements.get('bl-button-group')) {
  customElements.define('bl-button-group', BlocksButtonGroup)
}
