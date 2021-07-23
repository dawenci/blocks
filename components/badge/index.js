import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_base, __color_danger } from '../../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
}
#layout {
  position: relative;
  display: inline-block;
}
#badge {
  position: relative;
  top: -4px;
  left: -4px;
  height: 16px;
  line-height:16px;
  padding: 0 3px;
  border: 1px solid var(--color-danger, ${__color_danger});
  background-color: var(--color-danger, ${__color_danger});
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
}
</style>`

const TEMPLATE_HTML = `<div id="layout"><slot></slot></div><sup id="badge">999+</sup>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

export class BlocksBadge extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
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

if (!customElements.get('bl-badge')) {
  customElements.define('bl-badge', BlocksBadge)
}
