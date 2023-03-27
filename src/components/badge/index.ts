import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-badge',
  styles: [style],
})
export class BlocksBadge extends Component {
  @attr('string') accessor value = ''

  @shadowRef('#badge') accessor $badge: Element | null = null

  constructor() {
    super()
    this.appendShadowChild(template())

    const render = () => {
      this.$badge!.textContent = this.value
    }
    this.onConnected(render)
    this.onAttributeChangedDep('value', render)
    this.onRender(render)
  }
}
