import { enumGetter, enumSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_base, __border_color_light, __padding_base, __radius_base } from '../../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  display: block;
  /* 描边 * 4 + 底部阴影 */
  border-radius: var(--radius-base, ${__radius_base});
  box-shadow: 0 0 0 1px var(--border-color-light, ${__border_color_light});
}

:host([shadow]:not([shadow="hover"])),
:host([shadow="hover"]:hover) {
  box-shadow:
    0px -1px 0px 0px rgba(0, 0, 0, 0.05),
    0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
}

#header {
  padding: 0 var(--padding-base, ${__padding_base});
}
#header.empty {
  display: none;
}

#body {
  padding: var(--padding-base, ${__padding_base});
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <header id="header"><slot name="header"></slot></header>
  <div id="body">
    <slot></slot>
  </div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksCard extends HTMLElement {
  static get observedAttributes() {
    return ['shadow']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$header = shadowRoot.getElementById('header')
    this.$body = shadowRoot.getElementById('body')

    const $headerSlot = this.$header.querySelector('slot')
    const updateHeader = () => {
      const childCount = $headerSlot.assignedNodes().filter(node => node.nodeType === 1 || node.nodeType === 3).length
      this.$header.classList.toggle('empty', !childCount)
    }
    $headerSlot.addEventListener('slotchange', updateHeader)
    updateHeader()
  }

  get shadow() {
    return enumGetter('shadow', [null, 'hover', 'always'])(this)
  }

  set shadow(value) {
    enumSetter('shadow', [null, 'hover', 'always'])(this, value)
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

if (!customElements.get('bl-card')) {
  customElements.define('bl-card', BlocksCard)
}
