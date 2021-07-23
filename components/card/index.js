import { enumGetter, enumSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_base, __border_color_light, __font_size_base, __font_size_large, __font_size_small, __padding_base, __padding_large, __padding_small, __radius_base } from '../../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  --padding: var(--padding-base, ${__padding_base});
  --border-color: #ebebeb;
  --radius: var(--radius-base, ${__radius_base});
  --font-size: var(--font-size-base, ${__font_size_base});
  --shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.05),
    0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);

  box-sizing: border-box;
  display: block;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: var(--font-size);
}
:host([size="small"]) {
  --padding: var(--padding-small, ${__padding_small});
  --font-size: var(--font-size-small, ${__font_size_small});
}
:host([size="large"]) {
  --padding: var(--padding-large, ${__padding_large});
  --font-size: var(--font-size-large, ${__font_size_large});
}

:host([shadow]:not([shadow="hover"])),
:host([shadow="hover"]:hover) {
  border-color: transparent;
  box-shadow: var(--shadow);
}

::slotted(img) { 
  max-width: 100%;
}

#header,
#footer,
#cover,
#body {
  overflow: hidden;
  padding: var(--padding);
}
#header.empty,
#footer.empty,
#cover.empty {
  display: none;
}

#cover {
  border-radius: var(--radius) var(--radius) 0 0;
  margin: -1px -1px 0 -1px;
  padding: 0;
}

#header {
  border-bottom: 1px solid var(--border-color);
}

#footer {
  border-top: 1px solid var(--border-color);
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <div id="cover"><slot name="cover"></slot></div>
  <header id="header"><slot name="header"></slot></header>
  <div id="body"><slot></slot></div>
  <div id="footer"><slot name="footer"></slot></div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

export class BlocksCard extends HTMLElement {
  static get observedAttributes() {
    return ['shadow', 'size', 'card-title']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$header = shadowRoot.getElementById('header')
    this.$body = shadowRoot.getElementById('body')

    const updateSlotParent = ($slot) => {
      const childCount = $slot.assignedNodes().filter($node => $node.nodeType === 1 || $node.nodeType === 3).length
      $slot.parentElement.classList.toggle('empty', !childCount)
    }
    const onSlotChange = (e) => {
      updateSlotParent(e.target)
    }
    Array.prototype.forEach.call(shadowRoot.querySelectorAll('slot'), ($slot) => {
      $slot.addEventListener('slotchange', onSlotChange)
      updateSlotParent($slot)
    })
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
