import { Component } from '../Component.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { domRef } from '../../decorators/domRef.js'
import { template } from './template.js'
import { style } from './style.js'

@defineClass({
  customElement: 'bl-badge',
  styles: [style],
})
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

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    this.render()
  }
}
