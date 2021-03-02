import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import {
  $fontFamily,
  $radiusSmall,
  $colorPrimary,
  $colorPrimaryLight,
  $colorPrimaryDark,
  $colorDisabled,
  $borderColorBase,
  $borderColorDisabled,
  $backgroundColorDisabled,
  $transitionDuration,
} from '../theme/var.js'

const TEMPLATE_CSS = `
<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  font-size: 0;
  font-family: ${$fontFamily};
  text-align: center;
  transition: color ${$transitionDuration}, border-color ${$transitionDuration};
  all: initial;
  contain: content;
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
  border-radius: ${$radiusSmall};
  border-width: 1px;
  border-style: solid;
  border-color: ${$borderColorBase};
  cursor: pointer;
}

#label {
  display: inline-block;
}

/* hover 框线高亮 */
:host(:hover) #checkbox,
:host(:focus) #checkbox {
  border-color: ${$colorPrimary};
}

/* 选中状态、不确定状态，框线、背景高亮 */
:host([checked]) #checkbox,
:host #checkbox[indeterminate],
:host #checkbox[indeterminate] {
  border-color: ${$colorPrimary};
  background-color: ${$colorPrimary};
}

/* 选中状态、不确定状态，hover、foucs 高光高亮 */
:host(:hover) #checkbox[indeterminate],
:host(:focus) #checkbox[indeterminate],
:host([checked]:hover) #checkbox,
:host([checked]:focus) #checkbox {
  border-color: ${$colorPrimaryLight};
  background-color: ${$colorPrimaryLight};
}

/* 激活状态，加深高亮 */
:host([checked]:active) #checkbox,
:host(:active) #checkbox[indeterminate] {
  border-color: ${$colorPrimaryDark};
  background-color: ${$colorPrimaryDark};
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

#label, #checkbox + * {
  cursor: default;
  font-size: 14px;
}
#label {
  margin-left: 3px;
}
#label:empty {
  display: none;
}

:host([disabled]) {
  color: ${$colorDisabled};
}
:host([disabled]) #checkbox,
:host([disabled]:hover) #checkbox,
:host([disabled]:active) #checkbox,
:host([disabled]:focus) #checkbox {
  border-color: ${$borderColorDisabled};
  background-color: ${$backgroundColorDisabled};
}

:host([disabled][checked]) #checkbox,
:host([disabled][checked]:hover) #checkbox,
:host([disabled][checked]:active) #checkbox,
:host([disabled][checked]:focus) #checkbox {
  background-color: ${$borderColorDisabled};
}

:host([disabled]) * {
  cursor: not-allowed;
}
</style>
`
const TMEPLATE_HTML = `
<div id="layout">
  <span id="checkbox"></span>
  <slot name="label"><label id="label"></label></slot>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TMEPLATE_HTML

class BlocksCheckbox extends HTMLElement {
  _indeterminate = false

  static get observedAttributes() {
    return ['name', 'value', 'label', 'checked', 'disabled']
  }

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    const fragment = template.content.cloneNode(true)
    shadowRoot.appendChild(fragment)
    this.$checkbox = shadowRoot.querySelector('#checkbox')
    this.$label = shadowRoot.querySelector('#label')

    this.shadowRoot.addEventListener('click', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopPropagation()
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

  get label() {
    return this.getAttribute('label')
  }

  set label(value) {
    this.setAttribute('label', value)
    this._renderLabel()
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    }
    else {
      this.setAttribute('disabled', '')
    }
  }

  get checked() {
    return this.getAttribute('checked') !== null
  }

  set checked(value) {
    if (value === null || value === false) {
      this.removeAttribute('checked')
    }
    else {
      this.setAttribute('checked', '')
    }
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

  _renderLabel() {
    if (!this.querySelector('[slot="label"]') && this.label) {
      const label = this.shadowRoot.querySelector('#label')
      label.innerHTML = this.label
    }
  }

  connectedCallback() {
    setRole(this, 'checkbox')
    setDisabled(this, this.disabled)
    setTabindex(this, !this.disabled)

    this._renderLabel()
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

if (!customElements.get('blocks-checkbox')) {
  customElements.define('blocks-checkbox', BlocksCheckbox)
}