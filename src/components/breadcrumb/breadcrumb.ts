import type { BlBreadcrumbItem } from './item.js'
import './item.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './breadcrumb.style.js'
import { template } from './breadcrumb.template.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-breadcrumb',
  styles: [style],
})
export class BlBreadcrumb extends BlComponent {
  @attr('string') accessor separator = '/'

  @shadowRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()
    this.appendShadowChild(template())
    this.#setupSeparator()
  }

  #setupSeparator() {
    const render = () => {
      this.$slot.assignedElements().forEach($item => {
        if (isItem($item)) {
          $item._renderSeparator(this.separator)
        }
      })
    }
    this.hook.onRender(render)
    this.hook.onConnected(render)
    this.hook.onAttributeChangedDep('separator', render)
    this.hook.onConnected(() => {
      this.$slot.addEventListener('slotchange', render)
    })
    this.hook.onDisconnected(() => {
      this.$slot.removeEventListener('slotchange', render)
    })
  }
}

function isItem(item: Element): item is BlBreadcrumbItem {
  return !!(item as BlBreadcrumbItem)._renderSeparator
}
