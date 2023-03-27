import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { strSetter } from '../../common/property.js'
import { style } from './item.style.js'
import { template } from './item.template.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-breadcrumb-item',
  styles: [style],
})
export class BlocksBreadcrumbItem extends Component {
  @attr('string') accessor href = ''

  @shadowRef('#separator') accessor $separator!: HTMLDivElement

  @shadowRef('#link') accessor $link!: HTMLAnchorElement

  constructor() {
    super()
    this.appendShadowChild(template())

    this.#setupLink()
  }

  #setupLink() {
    const render = () => {
      strSetter('href')(this.$link, this.href || null)
    }
    this.onRender(render)
    this.onConnected(render)
    this.onAttributeChangedDep('href', render)
  }
  _renderSeparator(separator: string) {
    if (this.parentElement?.lastElementChild === this) return
    this.$separator.textContent = separator
  }
}
