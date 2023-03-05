import { Component } from '../Component.js'
import { style, template } from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { ref } from '../../decorators/ref.js'

export interface BlocksBadge extends Component {
  _ref: {
    $slot: HTMLSlotElement
    $badge: HTMLElement
  }
}

@customElement('bl-badge')
@attachShadow
@applyStyle(style)
export class BlocksBadge extends Component {
  @attr('string') accessor value = ''

  @ref('#badge')
  get $badge(): Element | null {
    return null
  }

  constructor() {
    super()

    this.shadowRoot!.appendChild(template())

    this._ref = {
      $slot: this.shadowRoot!.querySelector('slot')!,
      $badge: this.shadowRoot!.getElementById('badge')!,
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
