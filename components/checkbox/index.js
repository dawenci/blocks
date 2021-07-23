import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { dispatchEvent } from '../../common/event.js'
import { checkedGetter, checkedSetter, disabledGetter, disabledSetter } from '../../common/propertyAccessor.js'
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
} from '../../theme/var.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: inline-block;
  vertical-align: middle;
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

#checkbox {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  overflow: hidden;
  width: 14px;
  height: 14px;
  border-radius: var(--radius-small, ${__radius_small});
  border-width: 1px;
  border-style: solid;
  border-color: var(--border-color-base, ${__border_color_base});
  cursor: pointer;
}

#label {
  display: inline-block;
}

/* hover 框线高亮 */
:host(:hover) #checkbox,
:host(:focus) #checkbox {
  border-color: var(--color-primary, ${__color_primary});
}

/* 选中状态、不确定状态，框线、背景高亮 */
:host([checked]) #checkbox,
:host #checkbox[indeterminate],
:host #checkbox[indeterminate] {
  border-color: var(--color-primary, ${__color_primary});
  background-color: var(--color-primary, ${__color_primary});
}

/* 选中状态、不确定状态，hover、foucs 高光高亮 */
:host(:hover) #checkbox[indeterminate],
:host(:focus) #checkbox[indeterminate],
:host([checked]:hover) #checkbox,
:host([checked]:focus) #checkbox {
  border-color: var(--color-primary-light, ${__color_primary_light});
  background-color: var(--color-primary-light, ${__color_primary_light});
}

/* 激活状态，加深高亮 */
:host([checked]:active) #checkbox,
:host(:active) #checkbox[indeterminate] {
  border-color: var(--color-primary-dark, ${__color_primary_dark});
  background-color: var(--color-primary-dark, ${__color_primary_dark});
}

/* 不确定状态，内部渲染横杠 */
:host #checkbox[indeterminate]::before {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(.5);
  left: 0;
  right: 0;
  top: 5px;
}

/* 选中状态，内部渲染对勾 */
:host([checked]) #checkbox::before {
  box-sizing: content-box;
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform .15s ease-in .05s;
  transform-origin: center;
  transform: rotate(45deg) scaleY(1);
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
}
:host([disabled]) #checkbox,
:host([disabled]:hover) #checkbox,
:host([disabled]:active) #checkbox,
:host([disabled]:focus) #checkbox {
  border-color: var(--border-color-disabled, ${__border_color_disabled});
  background-color: var(--bg-disabled, ${__bg_disabled});
}

:host([disabled][checked]) #checkbox,
:host([disabled][checked]:hover) #checkbox,
:host([disabled][checked]:active) #checkbox,
:host([disabled][checked]:focus) #checkbox {
  background-color: var(--border-color-disabled, ${__border_color_disabled});
}

:host([disabled]) * {
  cursor: not-allowed;
}
</style>
`
const TMEPLATE_HTML = `
<div id="layout">
  <span id="checkbox"></span>
  <label id="label"><slot></slot></label>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TMEPLATE_HTML

export class BlocksCheckbox extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'checked', 'disabled']
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    const fragment = template.content.cloneNode(true)
    this.shadowRoot.appendChild(fragment)
    this.$checkbox = this.shadowRoot.querySelector('#checkbox')
    this.$label = this.shadowRoot.querySelector('#label')
    this.$slot = this.shadowRoot.querySelector('slot')

    this.$label.classList[this.$slot.assignedNodes().length ? 'remove' : 'add']('empty')
    this.$slot.addEventListener('slotchange', (e) => {
      this.$label.classList[this.$slot.assignedNodes().length ? 'remove' : 'add']('empty')
    })

    this._indeterminate = false

    this.shadowRoot.addEventListener('click', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      this.indeterminate = false
      this.checked = !this.checked
    })

    this.addEventListener('keydown', (e) => {
      if (this.disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        this.checked = !this.checked
        // 放置空格导致滚动
        e.preventDefault()
      }
    })
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

  get indeterminate() {
    return this._indeterminate
  }

  set indeterminate(v) {
    if (v) {
      this.checked = false
      this._indeterminate = true
    }
    else {
      this._indeterminate = false
    }
    this._renderIndeterminate()
  }

  _renderIndeterminate() {
    const checkbox = this.shadowRoot.querySelector('#checkbox')
    if (this.indeterminate) {
      checkbox.setAttribute('indeterminate', '')
    }
    else {
      checkbox.removeAttribute('indeterminate')
    }
  }

  connectedCallback() {
    setRole(this, 'checkbox')
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
      if (this.checked) {
        this.indeterminate = false
      }
      dispatchEvent(this, 'change', { detail: { value: this.checked } })
    }
  }
}

if (!customElements.get('bl-checkbox')) {
  customElements.define('bl-checkbox', BlocksCheckbox)
}
