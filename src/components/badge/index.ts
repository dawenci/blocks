import { Component } from '../Component.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { domRef } from '../../decorators/domRef.js'
import { template } from './template.js'
import { style } from './style.js'

@customElement('bl-badge')
@attachShadow
@applyStyle(style)
export class BlocksBadge extends Component {
  @attr('string') accessor value = ''

  @domRef('#badge')
  accessor $badge: Element | null = null

  constructor() {
    super()

    this.shadowRoot!.appendChild(template())
  }

  override render() {
    this.$badge!.textContent = this.value
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
