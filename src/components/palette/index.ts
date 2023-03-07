import { Component } from '../Component.js'
import { template } from './template.js'

export class BlocksPalette extends Component {
  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template().content.cloneNode(true))
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }
}

if (!customElements.get('bl-palette')) {
  customElements.define('bl-palette', BlocksPalette)
}
