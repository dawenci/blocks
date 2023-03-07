import { customElement } from '../../decorators/customElement.js'
import { applyStyle } from '../../decorators/style.js'
import { attr, attrs } from '../../decorators/attr.js'
import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { style } from './style.js'

export interface BlocksCard extends Component {
  _ref: {
    $header: HTMLHeadElement
    $body: HTMLDivElement
  }
}

@customElement('bl-card')
@applyStyle(style)
export class BlocksCard extends Component {
  static override get observedAttributes() {
    return ['shadow', 'size']
  }

  @attr('enum', { enumValues: ['hover', 'always'] as const })
  accessor shadow!: NullableEnumAttr<['hover', 'always']>

  @attrs.size
  accessor size!: EnumAttrs['size']

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

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

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }
}
