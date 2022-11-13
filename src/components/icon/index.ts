import { strGetter, strSetter } from '../../common/property.js'
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { Component } from '../Component.js'
import { template } from './template.js'

type DomRef = {
  $layout: HTMLElement
}

export class BlocksIcon extends Component {
  ref: DomRef

  static override get observedAttributes() {
    return ['value', 'fill']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const fragment = template().content.cloneNode(true) as DocumentFragment
    const $layout = fragment.querySelector('#layout') as HTMLElement
    shadowRoot.appendChild(fragment)

    this.ref = {
      $layout,
    }
  }

  override render() {
    const { $layout } = this.ref
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

  get value() {
    return strGetter('value')(this)
  }

  set value(value) {
    strSetter('value')(this, value)
  }

  get fill() {
    return strGetter('fill')(this)
  }

  set fill(value) {
    strSetter('fill')(this, value)
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

if (!customElements.get('bl-icon')) {
  customElements.define('bl-icon', BlocksIcon)
}
