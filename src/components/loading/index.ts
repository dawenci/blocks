import { getRegisteredSvgIcon } from '../../icon/index.js'
import { Component } from '../Component.js'
import { template } from './template.js'

export class BlocksLoading extends Component {
  _ref: {
    $layout: HTMLElement
    $icon?: SVGElement
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))
    this._ref = {
      $layout: shadowRoot.querySelector('#layout') as HTMLElement,
    }
  }

  override render() {
    if (!this._ref.$icon) {
      this._ref.$icon = getRegisteredSvgIcon('loading')!
      this._ref.$layout.appendChild(this._ref.$icon)
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }
}

if (!customElements.get('bl-loading')) {
  customElements.define('bl-loading', BlocksLoading)
}
