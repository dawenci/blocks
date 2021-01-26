import {} from '../theme/var.js'

import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { upgradeProperty } from '../core/upgradeProperty.js'

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host(:focus) {
  outline: 0 none;
}
:host {
  overflow: hidden;
  display: inline-block;
  user-select: none;
  cursor: default;
}
.widget {
  width: 100%;
  height: 100%;
}
.widget svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>`

const TEMPLATE_HTML = `<div class="widget"></div>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksIcon extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
      'width',
      'height',
      'fill',
    ]
  }

  constructor() {
    super()

    this.attachShadow({
      mode: 'open',
      // 代理焦点，
      // 1. 点击 shadow DOM 内某个不可聚焦的区域，则第一个可聚焦区域将成为焦点
      // 2. 当 shadow DOM 内的节点获得焦点时，除了聚焦的元素外，:focus 还会应用到宿主
      // 3. 自己的 slot 中的元素聚焦，宿主不会获得焦点，但是 :focus-within 生效
      delegatesFocus: true
    })

    const fragment = template.content.cloneNode(true)
    this._widget = fragment.querySelector('.widget')
    this.shadowRoot.appendChild(fragment)
  }

  // TODO，size
  render() {
    if (this._widget.firstElementChild) this._widget.removeChild(this._widget.firstElementChild)
    const attrs = {}
    if (this.fill) attrs.fill = this.fill
    if (this.width) attrs.width = this.width
    if (this.height) attrs.height = this.height
    if (!attrs.width && !attrs.height) {
      attrs.width = attrs.height = 32
    }

    let icon = getRegisteredSvgIcon(this.value, attrs) ?? parseSvg(this.value, attrs)
    if (icon) this._widget.appendChild(icon)
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(value) {
    this.setAttribute('value', value)
  }

  get width() {
    return this.getAttribute('width')
  }

  set width(value) {
    return this.setAttribute('width', value)
  }

  get height() {
    return this.getAttribute('height')
  }

  set height(value) {
    return this.setAttribute('height', value)
  }

  get fill() {
    return this.getAttribute('fill')
  }

  set fill(value) {
    return this.setAttribute('fill', value)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }
}

if (!customElements.get('blocks-icon')) {
  customElements.define('blocks-icon', BlocksIcon)
}
