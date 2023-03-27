import type { BlocksBreadcrumbItem } from './item.js'
import './item.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './breadcrumb.style.js'
import { template } from './breadcrumb.template.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-breadcrumb',
  styles: [style],
})
export class BlocksBreadcrumb extends Component {
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
    this.onRender(render)
    this.onConnected(render)
    this.onAttributeChangedDep('separator', render)
    this.onConnected(() => {
      this.$slot.addEventListener('slotchange', render)
    })
    this.onDisconnected(() => {
      this.$slot.removeEventListener('slotchange', render)
    })
  }
}

function isItem(item: Element): item is BlocksBreadcrumbItem {
  return !!(item as BlocksBreadcrumbItem)._renderSeparator
}
