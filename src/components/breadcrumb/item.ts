import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { strSetter } from '../../common/property.js'
import { style } from './item.style.js'
import { template } from './item.template.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-breadcrumb-item',
  styles: [style],
})
export class BlBreadcrumbItem extends BlComponent {
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
    this.hook.onRender(render)
    this.hook.onConnected(render)
    this.hook.onAttributeChangedDep('href', render)
  }
  _renderSeparator(separator: string) {
    if (this.parentElement?.lastElementChild === this) return
    this.$separator.textContent = separator
  }
}
