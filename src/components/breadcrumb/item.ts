import { customElement } from '../../decorators/customElement.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'
import { domRef } from '../../decorators/domRef.js'
import { style } from './item.style.js'
import { strSetter } from '../../common/property.js'
import { Component } from '../Component.js'
import { template } from './item.template.js'

@customElement('bl-breadcrumb-item')
@attachShadow
@applyStyle(style)
export class BlocksBreadcrumbItem extends Component {
  @attr('string') accessor href = 'javascript(void 0)'

  @domRef('#separator') accessor $separator!: HTMLDivElement

  @domRef('#link') accessor $link!: HTMLAnchorElement

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!

    shadowRoot.appendChild(template().content.cloneNode(true))
  }

  _renderSeparator(separator: string) {
    if (this.parentElement?.lastElementChild === this) return
    this.$separator.textContent = separator
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
      strSetter('href')(this.$link, newValue)
    }
  }
}
