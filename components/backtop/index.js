import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __color_primary, __color_primary_light, __radius_base } from '../theme/var.js'

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host {
  position: fixed;
  bottom: 50px;
  right: 20px;
  display: inline-block;
  width: 32px;
  height: 32px;
}
#widget {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-base, ${__radius_base});
  background-color: var(--color-primary, ${__color_primary});
  color: #fff;
  font-family: sans-serif;
  cursor: pointer;
}
#widget:hover {
  background-color: var(--color-primary-light, ${__color_primary_light});
}
</style>`

const TEMPLATE_HTML = `
<div id="widget">UP</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksBackTop extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this._widget = shadowRoot.querySelector('#widget')

    // TODO, animate
    this._widget.onclick = () => {
      let parent = this.parentElement
      while (parent) {
        parent.scrollTop = 0
        parent = parent.parentElement
      }
    }
  }

  render() {}

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

if (!customElements.get('blocks-backtop')) {
  customElements.define('blocks-backtop', BlocksBackTop)
}
