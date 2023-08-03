import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-badge',
  styles: [style],
})
export class BlBadge extends BlComponent {
  @attr('string') accessor value = ''

  @shadowRef('#badge') accessor $badge: Element | null = null

  constructor() {
    super()
    this.appendShadowChild(template())

    const render = () => {
      this.$badge!.textContent = this.value
    }
    this.hook.onConnected(render)
    this.hook.onAttributeChangedDep('value', render)
    this.hook.onRender(render)
  }
}
