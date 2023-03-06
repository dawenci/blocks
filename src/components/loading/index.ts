import { getRegisteredSvgIcon } from '../../icon/index.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'

export interface BlocksLoading extends Component {
  _ref: {
    $layout: HTMLElement
    $icon?: SVGElement
  }
}

@customElement('bl-loading')
export class BlocksLoading extends Component {
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
