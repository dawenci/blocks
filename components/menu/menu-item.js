import '../../components/icon/index.js'

import { upgradeProperty } from '../../common/upgradeProperty.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { __color_primary, __fg_placeholder, __font_family } from '../theme/var.js'
import { boolGetter, boolSetter } from '../../common/property.js'

const TEMPLATE_CSS = `<style>
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
:host {
  display: block;
  position: relative;
  font-family: var(--font-family, ${__font_family});
  font-size: 14px;
  box-sizing: border-box;
  cursor: default;
}
#layout {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
}
#layout:hover {
  color: var(--color-primary, ${__color_primary});
  fill: var(--color-primary, ${__color_primary});
}
#content {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
#arrow {
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  fill: var(--fg-placeholder, ${__fg_placeholder});
}
::slotted(svg) {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
::slotted(img) {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <div id="content">
    <slot></slot>
  </div>
  <blocks-icon id="arrow" value="down"></blocks-icon>
</div>
<slot name="submenu"></slot>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksMenuItem extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
  }

  get expand() {
    return boolGetter('expand')(this)
  }

  set expand(value) {
    boolSetter('expand')(this, value)
  }

  render() {
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

if (!customElements.get('blocks-menu-item')) {
  customElements.define('blocks-menu-item', BlocksMenuItem)
}
