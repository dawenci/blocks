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
    transition: color .2s, border-color .2s;
    font-size: 0;
  }

  .checkbox {
    position: relative;
    display: block;
    overflow: hidden;
    width: 14px;
    height: 14px;
    border-radius: ${$radiusSmall};
    border-width: 1px;
    border-style: solid;
    cursor: pointer;
    border-color: ${$borderColorBase};
  }
  :host(:hover) .checkbox,
  :host(:focus) .checkbox {
    border-color: ${$colorPrimary};
  }

  :host([indeterminate]) .checkbox,
  :host([checked]) .checkbox {
    border-color: ${$colorPrimary};
    background-color: ${$colorPrimary};
  }
  :host([indeterminate]:hover) .checkbox,
  :host([indeterminate]:focus) .checkbox,
  :host([checked]:hover) .checkbox,
  :host([checked]:focus) .checkbox {
    border-color: ${$colorPrimaryLight};
    background-color: ${$colorPrimaryLight};
  }
  :host([indeterminate]) .checkbox:active,
  :host([checked]) .checkbox:active {
    border-color: ${$colorPrimaryDark};
    background-color: ${$colorPrimaryDark};
  }

  :host([indeterminate]) .checkbox::before {
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
  
  :host([checked]) .checkbox::before {
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

  label,
  .checkbox + * {
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
  :host([disabled]) .checkbox {
    border-color: ${$borderColorDisabled};
    background-color: ${$backgroundColorDisabled};
  }
  :host([disabled]) * {
    cursor: not-allowed;
  }
  </style>

  <span class="checkbox"></span>
  <slot name="label">
    <label></label>
  </slot>
`

class BlocksCheckbox extends HTMLElement {
  static get observedAttributes() {
    return [ 'name', 'value', 'label', 'checked', 'disabled', 'indeterminate' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.shadowRoot.addEventListener('click', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      this.checked = !this.checked
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
    return this.hasAttribute('indeterminate')
  }

  set indeterminate(v) {
    if (v) {
      this.checked = false
      this.setAttribute('indeterminate', '')
    }
    else {
      this.removeAttribute('indeterminate')
    }
  }

  _renderLabel() {
    if (!this.querySelector('[slot="label"]') && this.label) {
      const label = this.shadowRoot.querySelector('label')
      label.innerHTML = this.label
    }
  }

  connectedCallback() {
    this.setAttribute('role', 'checkbox')
    this.setAttribute('tabindex', '0')

    this._renderLabel()
  }

  disconnectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.disabled) {
      this.removeAttribute('tabindex')
      this.setAttribute('aria-disabled', 'true')
    }
    else {
      this.setAttribute('tabindex', '0')
      this.setAttribute('aria-disabled', 'false')
    }
  }
}

if (!customElements.get('blocks-checkbox')) {
  customElements.define('blocks-checkbox', BlocksCheckbox)
}