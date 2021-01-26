import { setDisabled, setRole, setTabindex, updateDisabled } from '../core/accessibility.js'
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

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host, :host * {
    box-sizing: border-box;
  }
  :host {
    font-family: ${$fontFamily};
    all: initial;
    contain: content;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    text-align: center;
    transition: color ${$transitionDuration}, border-color ${$transitionDuration};
    font-size: 0;
  }

  .radio {
    position: relative;
    display: block;
    overflow: hidden;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border-width: 1px;
    border-style: solid;
    cursor: pointer;
    border-color: ${$borderColorBase};
  }
  :host(:hover) .radio,
  :host(:focus) .radio {
    border-color: ${$colorPrimary};
  }

  :host([checked]) .radio {
    border-color: ${$colorPrimary};
    background-color: ${$colorPrimary};
  }
  :host([checked]:hover) .radio,
  :host([checked]:focus) .radio {
    border-color: ${$colorPrimaryLight};
    background-color: ${$colorPrimaryLight};
  }
  :host([checked]) .radio:active {
    border-color: ${$colorPrimaryDark};
    background-color: ${$colorPrimaryDark};
  }
 
  :host([checked]) .radio::before {
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
    transition: transform ${$transitionDuration} ease-in .05s;
    background-color: #fff;
  }

  label,
  .radio + * {
    cursor: default;
    font-size: 14px;
  }
  label {
    margin-left: 3px;
  }
  label:empty {
    display: none;
  }

  :host([disabled]) {
    color: ${$colorDisabled};
    outline: 0 none;
  }
  :host([disabled]) .radio,
  :host([disabled]:hover) .radio,
  :host([disabled]:active) .radio {
    border-color: ${$borderColorDisabled};
    background-color: ${$backgroundColorDisabled};
  }
  :host([disabled]) * {
    cursor: not-allowed;
  }
  </style>

  <span class="radio"></span>
  <slot name="label">
    <label></label>
  </slot>
`

class BlocksRadio extends HTMLElement {
  static get observedAttributes() {
    return [ 'name', 'value', 'label', 'checked', 'disabled' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

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
        e.stopPropagation()
        return
      }
      check()
    })

    this.addEventListener('keyup', (e) => {
      if (this.disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        check()
      }
    })
  }

  get name() {
    return this.getAttribute('name')
  }

  set name(value) {
    this.setAttribute('name', value)
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

  _renderLabel() {
    if (!this.querySelector('[slot="label"]') && this.label) {
      const label = this.shadowRoot.querySelector('label')
      label.innerHTML = this.label
    }
  }

  connectedCallback() {
    setRole(this, 'radio')
    setDisabled(this, this.disabled)
    setTabindex(this, !this.disabled)

    this._renderLabel()
  }

  disconnectedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      updateDisabled(this)
      setDisabled(this, this.disabled)
      setTabindex(this, !this.disabled)
    } 
  }
}

if (!customElements.get('blocks-radio')) {
  customElements.define('blocks-radio', BlocksRadio)
}
