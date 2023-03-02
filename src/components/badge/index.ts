import { strGetter, strSetter } from '../../common/property.js'
import { Component } from '../Component.js'
import { template } from './template.js'

export interface BlocksBadge extends Component {
  _ref: {
    $slot: HTMLSlotElement
    $badge: HTMLElement
  }
}

export class BlocksBadge extends Component {
  static override get observedAttributes() {
    return ['value']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))

    this._ref = {
      $slot: shadowRoot.querySelector('slot')!,
      $badge: shadowRoot.getElementById('badge')!,
    }
  }

  get value() {
    return strGetter('value')(this) ?? ''
  }

  set value(value) {
    strSetter('value')(this, value)
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

if (!customElements.get('bl-badge')) {
  customElements.define('bl-badge', BlocksBadge)
}
