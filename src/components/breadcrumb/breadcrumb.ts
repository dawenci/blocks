import { Component } from '../Component.js'
import { BlocksBreadcrumbItem } from './item.js'
import { template } from './breadcrumb-template.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

export interface BlocksBreadcrumb extends Component {
  _ref: {
    $slot: HTMLSlotElement
  }
}

@customElement('bl-breadcrumb')
export class BlocksBreadcrumb extends Component {
  static override get observedAttributes() {
    return ['separator']
  }

  #clearup?: () => void

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))

    this._ref = {
      $slot: shadowRoot.querySelector('slot') as HTMLSlotElement,
    }
  }

  @attr('string') accessor separator = '/'

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
