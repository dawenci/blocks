import { Component } from '../Component.js'
import { enumGetter, enumSetter } from '../../common/property.js'
import { template } from './template.js'

export interface BlocksCard extends Component {
  _ref: {
    $header: HTMLHeadElement
    $body: HTMLDivElement
  }
}

export class BlocksCard extends Component {
  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))

    this._ref = {
      $header: shadowRoot.getElementById('header') as HTMLHeadElement,
      $body: shadowRoot.getElementById('body') as HTMLDivElement,
    }

    const updateSlotParent = ($slot: HTMLSlotElement) => {
      const childCount = $slot
        .assignedNodes()
        .filter($node => $node.nodeType === 1 || $node.nodeType === 3).length
      $slot.parentElement?.classList?.toggle?.('empty', !childCount)
    }
    const onSlotChange = (e: Event) => {
      updateSlotParent(e.target as HTMLSlotElement)
    }
    Array.prototype.forEach.call(shadowRoot.querySelectorAll('slot'), $slot => {
      $slot.addEventListener('slotchange', onSlotChange)
      updateSlotParent($slot)
    })
  }

  get shadow() {
    return enumGetter('shadow', ['hover', 'always'] as const)(this)
  }

  set shadow(value) {
    enumSetter('shadow', ['hover', 'always'] as const)(this, value)
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  static override get observedAttributes() {
    return ['shadow', 'size']
  }
}

if (!customElements.get('bl-card')) {
  customElements.define('bl-card', BlocksCard)
}
