import { template } from './template.js'
import { BlComponent } from '../component/Component.js'

export class BlPalette extends BlComponent {
  constructor() {
    super()

    this.appendShadowChild(template().content.cloneNode(true))
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }
}

if (!customElements.get('bl-palette')) {
  customElements.define('bl-palette', BlPalette)
}
