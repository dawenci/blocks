import { Component } from '../Component.js'
import { BlocksBreadcrumbItem } from './item.js'
import { template } from './breadcrumb-template.js'
import { strGetter, strSetter } from '../../common/property.js'

export interface BlocksBreadcrumb extends Component {
  _ref: {
    $slot: HTMLSlotElement
  }
}

export class BlocksBreadcrumb extends Component {
  #clearup?: () => void

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))

    this._ref = {
      $slot: shadowRoot.querySelector('slot') as HTMLSlotElement,
    }
  }

  get separator() {
    return strGetter('separator')(this) ?? '/'
  }

  set separator(value) {
    strSetter('separator')(this, value)
  }

  override render() {
    this._ref.$slot.assignedElements().forEach($item => {
      if (isItem($item)) {
        $item.renderSeparator(this.separator)
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

  static override get observedAttributes() {
    return ['separator']
  }
}

if (!customElements.get('bl-breadcrumb')) {
  customElements.define('bl-breadcrumb', BlocksBreadcrumb)
}

function isItem(item: Element): item is BlocksBreadcrumbItem {
  return !!(item as BlocksBreadcrumbItem).renderSeparator
}
