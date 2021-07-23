import {
  __radius_base,
  __color_primary,
  __color_warning,
  __transition_duration,
  __border_color_base,
  __border_color_disabled,
  __height_base,
  __height_small,
  __height_large,
} from '../../theme/var.js'

import { getRegisteredSvgIcon } from '../../icon/index.js'
import '../popup/index.js'
import '../date/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { setDisabled, setRole } from '../../common/accessibility.js'

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  position: relative;
  box-sizing: border-box;
  height: var(--height-base, ${__height_base});
  padding: 0 calc(var(--height-base, ${__height_base}) / 3);
  font-size: 14px;
}
:host(:focus) {
  outline: 0 none;
}
:host(:focus-within) {
  border-color: var(--color-primary, ${__color_primary});
}

:host:before,
:host:after {
  position: absolute;
  top: auto;
  right: 0;
  bottom: auto;
  left: calc(var(--height-base, ${__height_base}) / 3);
  display: block;
  content: '';
  height: 1px;
  background: var(--border-color-base, ${__border_color_base});
  transform: scale(1, 0.5);
}
:host:before {
  top: -0.5px;
}
:host:after {
  bottom: -0.5px;
}
:host(:first-child):before,
:host(:last-child):after {
  left: 0;
}
:host(:not(:last-child)):after {
  display: none;
}

#layout {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
}
#prefix, #suffix {
  flex: 0 0 auto;
}
#label {
  flex: 1 1 auto;
}
</style>`

const TEMPLATE_HTML = `<div id="layout">
  <div id="prefix" part="prefix"><slot name="prefix"></slot></div>
  <div id="label" part="label"><slot id="slot"></slot></div>
  <div id="suffix" part="suffix"><slot name="suffix"></slot></div>
</div>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

export class BlocksItem extends HTMLElement {
  static get observedAttributes() {
    return [
      'prefix-icon',
      'suffix-icon',
    ]
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    const fragment = template.content.cloneNode(true)
    this.shadowRoot.appendChild(fragment)
    this.$layout = this.shadowRoot.getElementById('layout')
    this.$prefix = this.$layout.children[0]
    this.$label = this.$layout.children[1]
    this.$suffix = this.$layout.children[2]
  }

  render() {
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
  }
}

if (!customElements.get('bl-item')) {
  customElements.define('bl-item', BlocksItem)
}
