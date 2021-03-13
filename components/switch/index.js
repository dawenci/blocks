import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { dispatchEvent } from '../../common/event.js'
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
:host {
  all: initial;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  width: 38px;
  height: 20px;
  border-radius: 10px;
  contain: content;
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  font-size: 0;
}

#layout {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  background-color: rgba(0,0,0,.25);
  cursor: pointer;
}
:host(:not([disabled]):hover) #layout,
:host(:not([disabled]):focus) #layout {
  background-color: rgba(0,0,0,.20);
}

#layout:after {
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

:host([checked]) #layout {
  background-color: var(--color-primary, ${__color_primary});
}
:host([checked]) #layout:after {
  left: calc(100% - 17px);
}

:host([checked]:not([disabled]):hover) #layout,
:host([checked]:not([disabled]):focus) #layout {
  border-color: transparent;
  background-color: var(--color-primary-light, ${__color_primary_light});
}

:host([disabled]) {
  opacity: .4;
}
:host([disabled]) * {
  cursor: not-allowed;
}

:host([size="small"]) {
  width: 28px;
  height: 16px;
  border-radius: 8px;
}
:host([size="small"]) #layout:after {
  width: 12px;
  height: 12px;
}
:host([size="small"][checked]) #layout:after {
  left: calc(100% - 13px);
}

:host([size="large"]) {
  width: 48px;
  height: 24px;
  border-radius: 12px;
}
:host([size="large"]) #layout:after {
  width: 20px;
  height: 20px;
}
:host([size="large"][checked]) #layout:after {
  left: calc(100% - 22px);
}
</style>
`
const TEMPLATE_HTML = `
<div id="layout"></div>
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
