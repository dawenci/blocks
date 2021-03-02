import { upgradeProperty } from '../../common/upgradeProperty.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { __color_primary } from '../theme/var.js'

const TEMPLATE_CSS = `<style>
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
:host, :host * {
  box-sizing: border-box;
}
:host {
  position: absolute;  
  display: inline-block;
  width: 32px;
  height: 32px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
#layout {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
}
#layout svg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  animation: 1s linear infinite rotate360;
  fill: var(--color-primary, ${__color_primary});
  pointer-events: none;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout"></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksLoading extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.querySelector('#layout')
  }

  render() {
    const icon = getRegisteredSvgIcon('loading')

    this.$layout.innerHTML = ''
    this.$layout.appendChild(icon)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}
}

if (!customElements.get('blocks-loading')) {
  customElements.define('blocks-loading', BlocksLoading)
}
