import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'

export interface BlocksIcon extends Component {
  _ref: {
    $layout: HTMLElement
  }
}

@customElement('bl-icon')
export class BlocksIcon extends Component {
  static override get observedAttributes() {
    return ['value', 'fill']
  }

  @attr('string') accessor value!: string | null

  @attr('string') accessor fill!: string | null

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const fragment = template().content.cloneNode(true) as DocumentFragment
    const $layout = fragment.querySelector('#layout') as HTMLElement
    shadowRoot.appendChild(fragment)

    this._ref = {
      $layout,
    }
  }

  override render() {
    const { $layout } = this._ref
    if ($layout.firstElementChild) {
      $layout.removeChild($layout.firstElementChild)
    }

    const attrs: Record<string, string> = {}
    if (this.fill) {
      attrs.fill = this.fill
    }

    const icon =
      getRegisteredSvgIcon(this.value ?? '', attrs) ??
      parseSvg(this.value ?? '', attrs)

    if (icon) {
      $layout.appendChild(icon)
    }
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
    this.render()
  }
}
