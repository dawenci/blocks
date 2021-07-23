import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { checkedGetter, checkedSetter, disabledGetter, disabledSetter } from '../../common/propertyAccessor.js'
import {
  __font_family,
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __fg_disabled,
  __border_color_base,
  __border_color_disabled,
  __bg_disabled,
  __transition_duration,
} from '../../theme/var.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  font-family: var(--font-family, ${__font_family});
  text-align: center;
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  all: initial;
  contain: content;
  font-size: 14px;
}

#layout {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

#radio {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  border-color: var(--border-color-base, ${__border_color_base});
}
:host(:hover) #radio,
:host(:focus) #radio {
  border-color: var(--color-primary, ${__color_primary});
}

:host([checked]) #radio {
  border-color: var(--color-primary, ${__color_primary});
  background-color: var(--color-primary, ${__color_primary});
}
:host([checked]:hover) #radio,
:host([checked]:focus) #radio {
  border-color: var(--color-primary-light, ${__color_primary_light});
  background-color: var(--color-primary-light, ${__color_primary_light});
}
:host([checked]) #radio:active {
  border-color: var(--color-primary-dark, ${__color_primary_dark});
  background-color: var(--color-primary-dark, ${__color_primary_dark});
}

:host([checked]) #radio::before {
  box-sizing: border-box;
  content: "";
  border: 1px solid #fff;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  transition: transform var(--transition-duration, ${__transition_duration}) ease-in .05s;
  background-color: #fff;
}

#label {
  cursor: default;
  margin-left: 3px;
}

#label.empty {
  display: none;
}

:host([disabled]) {
  color: var(--color-disabled, ${__fg_disabled});
  outline: 0 none;
}
:host([disabled]) #radio,
:host([disabled]:hover) #radio,
:host([disabled]:active) #radio {
  border-color: var(--border-color-disabled, ${__border_color_disabled});
  background-color: var(--bg-disabled, ${__bg_disabled});
}

:host([disabled][checked]) #radio,
:host([disabled][checked]:hover) #radio,
:host([disabled][checked]:active) #radio {
  background-color: var(--border-color-disabled, ${__border_color_disabled});
}

:host([disabled]) * {
  cursor: not-allowed;
}
</style>
`
const TMEPLATE_HTML = `
<div id="layout">
  <span id="radio"></span>
  <label id="label"><slot></slot></label>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TMEPLATE_HTML

export class BlocksRadio extends HTMLElement {
  static get observedAttributes() {
    return [ 'name', 'checked', 'disabled' ]
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$radio = this.shadowRoot.querySelector('#radio')
    this.$label = this.shadowRoot.querySelector('#label')
    this.$slot = this.shadowRoot.querySelector('slot')

    this.$label.classList[this.$slot.assignedNodes().length ? 'remove' : 'add']('empty')
    this.$slot.addEventListener('slotchange', (e) => {
      this.$label.classList[this.$slot.assignedNodes().length ? 'remove' : 'add']('empty')
    })

    const check = () => {
      if (!this.checked) {
        document.getElementsByName(this.name)
          .forEach(el => {
            if (el !== this && el instanceof BlocksRadio) {
              el.checked = false
            }
          })
        this.checked = true
      }
    }

    this.shadowRoot.addEventListener('click', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      check()
    })

    this.addEventListener('keydown', (e) => {
      if (this.disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        check()
        e.preventDefault()
      }
    })
  }

  get name() {
    return this.getAttribute('name')
  }

  set name(value) {
    this.setAttribute('name', value)
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get checked() {
    return checkedGetter(this)
  }

  set checked(value) {
    checkedSetter(this, value)
  }

  connectedCallback() {
    setRole(this, 'radio')
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
  }
}

if (!customElements.get('bl-radio')) {
  customElements.define('bl-radio', BlocksRadio)
}
