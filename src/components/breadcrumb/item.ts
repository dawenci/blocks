import { strGetter, strSetter } from '../../common/property.js'
import { Component } from '../Component.js'
import { template } from './item-template.js'

export class BlocksBreadcrumbItem extends Component {
  ref: {
    $link: HTMLAnchorElement
    $separator: HTMLDivElement
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))
    this.ref = {
      $link: shadowRoot.getElementById('link') as HTMLAnchorElement,
      $separator: shadowRoot.getElementById('separator') as HTMLDivElement,
    }
  }

  get href() {
    return strGetter('href')(this) ?? 'javascript(void 0)'
  }

  set href(value) {
    strSetter('href')(this, value)
  }

  renderSeparator(separator: string) {
    if (this.parentElement?.lastElementChild === this) return
    this.ref.$separator.textContent = separator
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
      strSetter('href')(this, this.href || null)
    }
  }

  static override get observedAttributes() {
    return ['href']
  }
}

if (!customElements.get('bl-breadcrumb-item')) {
  customElements.define('bl-breadcrumb-item', BlocksBreadcrumbItem)
}
