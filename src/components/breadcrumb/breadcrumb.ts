import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { style } from './breadcrumb.style.js'
import { Component } from '../Component.js'
import { BlocksBreadcrumbItem } from './item.js'
import { template } from './breadcrumb.template.js'

export interface BlocksBreadcrumb extends Component {
  _ref: {
    $slot: HTMLSlotElement
  }
}

@defineClass({
  customElement: 'bl-breadcrumb',
  styles: [style],
})
export class BlocksBreadcrumb extends Component {
  @attr('string') accessor separator = '/'

  #clearup?: () => void

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template().content.cloneNode(true))

    this._ref = {
      $slot: shadowRoot.querySelector('slot') as HTMLSlotElement,
    }
  }

  override render() {
    this._ref.$slot.assignedElements().forEach($item => {
      if (isItem($item)) {
        $item._renderSeparator(this.separator)
      }
    })
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()

    const onSlotChange = () => this.render()
    this._ref.$slot.addEventListener('slotchange', onSlotChange)

    this.#clearup = () => {
      this._ref.$slot.removeEventListener('slotchange', onSlotChange)
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this.#clearup) {
      this.#clearup()
    }
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

function isItem(item: Element): item is BlocksBreadcrumbItem {
  return !!(item as BlocksBreadcrumbItem)._renderSeparator
}
