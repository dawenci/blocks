import { strGetter, strSetter } from '../../common/property.js'
import { Component } from '../Component.js'
import { template } from './item-template.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

export interface BlocksBreadcrumbItem extends Component {
  _ref: {
    $link: HTMLAnchorElement
    $separator: HTMLDivElement
  }
}

@customElement('bl-breadcrumb-item')
export class BlocksBreadcrumbItem extends Component {
  static override get observedAttributes() {
    return ['href']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))
    this._ref = {
      $link: shadowRoot.getElementById('link') as HTMLAnchorElement,
      $separator: shadowRoot.getElementById('separator') as HTMLDivElement,
    }
  }

  @attr('string') accessor href = 'javascript(void 0)'

  _renderSeparator(separator: string) {
    if (this.parentElement?.lastElementChild === this) return
    this._ref.$separator.textContent = separator
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'href') {
      strSetter('href')(this._ref.$link, newValue)
    }
  }
}
