import { Component } from '../Component.js'
import { template } from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

export interface BlocksBadge extends Component {
  _ref: {
    $slot: HTMLSlotElement
    $badge: HTMLElement
  }
}

@customElement('bl-badge')
export class BlocksBadge extends Component {
  @attr('string') accessor value = ''

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))

    this._ref = {
      $slot: shadowRoot.querySelector('slot')!,
      $badge: shadowRoot.getElementById('badge')!,
    }
  }

  override render() {
    this._ref.$badge.textContent = this.value
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    this.render()
  }
}
