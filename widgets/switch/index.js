import { setDisabled, setRole, setTabindex } from '../core/accessibility.js'
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
    all: initial;
    contain: content;
    box-sizing: border-box;
    display: inline-block;
    align-items: center;
    text-align: center;
    transition: color ${$transitionDuration}, border-color ${$transitionDuration};
    font-size: 0;
  }

  .switch {
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
  :host(:not([disabled]):hover) .switch,
  :host(:not([disabled]):focus) .switch {
    background-color: rgba(0,0,0,.20);
  }  

  .switch:after {
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
    transition: all ${$transitionDuration};
  }

  :host([checked]) .switch {
    background-color: ${$colorPrimary};
  }
  :host([checked]) .switch:after {
    left: calc(100% - 17px);
  }  

  :host([checked]:not([disabled]):hover) .switch,
  :host([checked]:not([disabled]):focus) .switch {
    border-color: transparent;
    background-color: ${$colorPrimaryLight};
  }

  :host([disabled]) {
    opacity: .4;
  }
  :host([disabled]) * {
    cursor: not-allowed;
  }

  :host([size="small"]) .switch {
    width: 28px;
    height: 16px;
    border-radius: 8px;
  }
  :host([size="small"]) .switch:after {
    width: 12px;
    height: 12px;
  }
  :host([size="small"][checked]) .switch:after {
    left: calc(100% - 13px);
  }
  </style>

  <span class="switch"></span>
`

class BlocksSwitch extends HTMLElement {
  static get observedAttributes() {
    return [ 'checked', 'disabled', 'size' ]
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

    this.addEventListener('keyup', (e) => {
      if (this.disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        this.checked = !this.checked
      }
    })
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }

  set disabled(v) {
    if (v) {
      this.setAttribute('disabled', '')
    }
    else {
      this.removeAttribute('disabled')
    }
  }

  get checked() {
    return this.hasAttribute('checked')
  }

  set checked(v) {
    if (v) {
      this.setAttribute('checked', '')
    }
    else {
      this.removeAttribute('checked')
    }
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
  }
}

if (!customElements.get('blocks-switch')) {
  customElements.define('blocks-switch', BlocksSwitch)
}
