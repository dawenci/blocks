import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { dispatchEvent } from '../../common/event.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { checkedGetter, checkedSetter, disabledGetter, disabledSetter, sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import {
  __font_family,
  __radius_small,
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __fg_disabled,
  __border_color_base,
  __border_color_disabled,
  __bg_disabled,
  __transition_duration,
} from '../theme/var.js'

const TEMPLATE_CSS = `
<style>
:host, :host * {
  box-sizing: border-box;
}
:host {
  all: initial;
  contain: content;
  box-sizing: border-box;
  display: inline-block;
  align-items: center;
  text-align: center;
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  font-size: 0;
}

#switch {
  overflow: hidden;
  position: relative;
  display: block;
  overflow: hidden;
  width: 38px;
  height: 20px;
  border-radius: 10px;
  cursor: pointer;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  background-color: rgba(0,0,0,.25);
}
:host(:not([disabled]):hover) #switch,
:host(:not([disabled]):focus) #switch {
  background-color: rgba(0,0,0,.20);
}

#switch:after {
  position: absolute;
  top: 1px;
  left: 1px;
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  overflow: hidden;
  transition: all var(--transition-duration, ${__transition_duration});
}

:host([checked]) #switch {
  background-color: var(--color-primary, ${__color_primary});
}
:host([checked]) #switch:after {
  left: calc(100% - 17px);
}

:host([checked]:not([disabled]):hover) #switch,
:host([checked]:not([disabled]):focus) #switch {
  border-color: transparent;
  background-color: var(--color-primary-light, ${__color_primary_light});
}

:host([disabled]) {
  opacity: .4;
}
:host([disabled]) * {
  cursor: not-allowed;
}

:host([size="small"]) #switch {
  width: 28px;
  height: 16px;
  border-radius: 8px;
}
:host([size="small"]) #switch:after {
  width: 12px;
  height: 12px;
}
:host([size="small"][checked]) #switch:after {
  left: calc(100% - 13px);
}
</style>
`
const TEMPLATE_HTML = `
<div id="switch"></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksSwitch extends HTMLElement {
  static get observedAttributes() {
    return ['checked', 'disabled', 'size']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.shadowRoot.addEventListener('click', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      this.checked = !this.checked
    })

    this.addEventListener('keyup', (e) => {
      if (this.disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        this.checked = !this.checked
      }
    })
  }

  get checked() {
    return checkedGetter(this)
  }

  set checked(value) {
    checkedSetter(this, value)
  }  

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  connectedCallback() {
    setRole(this, 'switch')
    setDisabled(this, this.disabled)
    setTabindex(this, !this.disabled)
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      setDisabled(this, this.disabled)
      setTabindex(this, !this.disabled)
    }
    if (name === 'checked') {
      dispatchEvent(this, 'change', { detail: { value: this.checked } })
    }
  }
}

if (!customElements.get('bl-switch')) {
  customElements.define('bl-switch', BlocksSwitch)
}
