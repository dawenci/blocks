import {
  $fontFamily,
  $colorPrimary,
  $colorPrimaryLight,
  $colorPrimaryDark,
  $colorDanger,
  $colorDangerLight,
  $colorDangerDark,
  $colorSuccess,
  $colorSuccessLight,
  $colorSuccessDark,
  $colorWarning,
  $colorWarningLight,
  $colorWarningDark,
  $colorDisabled,

  $borderColorDisabled,
  $backgroundColorDisabled,
  $transitionDuration,
  $colorFontBase,
  $borderColorBase,

  $radiusBase,

  $heightMini,
  $heightBase,
  $heightSmall,
  $heightLarge,
} from '../theme/var.js'

import { getRegisteredSvgIcon } from '../../icon/index.js'
import { setDisabled, setRole, setTabindex } from '../core/accessibility.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../core/property.js'

const disabledGetter = boolGetter('disabled')
const disabledSetter = boolSetter('disabled')
const typeGetter = enumGetter('type', [null, 'primary', 'danger', 'warning', 'success', 'link'])
const typeSetter = enumSetter('type', [null, 'primary', 'danger', 'warning', 'success', 'link'])
const sizeGetter = enumGetter('size', [null, 'small', 'mini', 'large'])
const sizeSetter = enumSetter('size', [null, 'small', 'mini', 'large'])

const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    display: inline-block;
  }

  :host([disabled]) {
    outline: 0 none;
    cursor: not-allowed;
  }

  :host(:focus) {
    outline: 0 none;
  }    

  :host([hidden]) {
    display: none;
  }

  .widget {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-family: ${$fontFamily};
    box-sizing: border-box;
    border-radius: ${$radiusBase};
    border-width: 1px;
    border-style: solid;
    cursor: pointer;
    text-align: center;
    transition: color ${$transitionDuration}, border-color ${$transitionDuration};
    user-select: none;
  }

  .prefix-icon, .suffix-icon {
    flex: 0 0 auto;
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    transition: transform ${$transitionDuration};
  }
  .prefix-icon svg,
  .suffix-icon svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .label {
    flex: 1 1 100%;
    display: block;
    height: 16px;
    line-height: 16px;
    box-sizing: border-box;
    white-space: nowrap;
  }

  
  /* background */
  :host .widget,
  :host .widget:hover,
  :host .widget:active { background-color: #fff; }

  :host([type="primary"]) .widget { background-color: ${$colorPrimary}; }
  :host([type="primary"]) .widget:hover,
  :host([type="primary"]:focus) .widget { background-color: ${$colorPrimaryLight}; }
  :host([type="primary"]) .widget:active { background-color: ${$colorPrimaryDark}; }

  :host([type="danger"]) .widget { background-color: ${$colorDanger}; }
  :host([type="danger"]) .widget:hover,
  :host([type="danger"]:focus) .widget { background-color: ${$colorDangerLight}; }
  :host([type="danger"]) .widget:active { background-color: ${$colorDangerDark}; }

  :host([type="success"]) .widget { background-color: ${$colorSuccess}; }
  :host([type="success"]) .widget:hover,
  :host([type="success"]:focus) .widget { background-color: ${$colorSuccessLight}; }
  :host([type="success"]) .widget:active { background-color: ${$colorSuccessDark}; }

  :host([type="warning"]) .widget { background-color: ${$colorWarning}; }
  :host([type="warning"]) .widget:hover,
  :host([type="warning"]:focus) .widget { background-color: ${$colorWarningLight}; }
  :host([type="warning"]) .widget:active { background-color: ${$colorWarningDark}; }

  :host([disabled]) .widget,
  :host([disabled]) .widget:hover,
  :host([disabled]:focus) .widget,
  :host([disabled]) .widget:active { background-color: ${$backgroundColorDisabled}; }

  :host([outline]) .widget,
  :host([outline]) .widget:hover,
  :host([outline]:focus) .widget,
  :host([outline]) .widget:active { background-color: transparent; }

  :host([type="link"]),
  :host([type="link"]) .widget:hover,
  :host([type="link"]:focus) .widget,
  :host([type="link"]) .widget:active { background-color: transparent; }


  /* border-color */
  :host .widget { border-color: ${$borderColorBase}; }
  :host .widget:hover,
  :host(:focus) .widget { border-color: ${$colorPrimaryLight}; }
  :host .widget:active { border-color: ${$colorPrimaryDark}; }

  :host([type="primary"]) .widget { border-color: ${$colorPrimary}; }
  :host([type="primary"]) .widget:hover,
  :host([type="primary"]:focus) .widget { border-color: ${$colorPrimaryLight}; }
  :host([type="primary"]) .widget:active {border-color: ${$colorPrimaryDark}; }

  :host([type="danger"]) .widget { border-color: ${$colorDanger}; }
  :host([type="danger"]) .widget:hover,
  :host([type="danger"]:focus) .widget { border-color: ${$colorDangerLight}; }
  :host([type="danger"]) .widget:active { border-color: ${$colorDangerDark}; }

  :host([type="warning"]) .widget { border-color: ${$colorWarning}; }
  :host([type="warning"]) .widget:hover,
  :host([type="warning"]:focus) .widget { border-color: ${$colorWarningLight}; }
  :host([type="warning"]) .widget:active { border-color: ${$colorWarningDark}; }

  :host([type="success"]) .widget { border-color: ${$colorSuccess}; }
  :host([type="success"]) .widget:hover,
  :host([type="success"]:focus) .widget { border-color: ${$colorSuccessLight}; }
  :host([type="success"]) .widget:active { border-color: ${$colorSuccessDark}; }
  
  :host([disabled]) .widget,
  :host([disabled]) .widget:hover,
  :host([disabled]:focus) .widget,
  :host([disabled]) .widget:active { border-color: ${$borderColorDisabled}; }

  :host([type="link"]) .widget,
  :host([type="link"]) .widget:hover,
  :host([type="link"]:focus) .widget,
  :host([type="link"]) .widget:active { border-color: transparent; }


  /* color */
  :host .widget { fill: ${$colorFontBase}; color: ${$colorFontBase}; }
  :host .widget:hover,
  :host(:focus) .widget { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
  :host .widget:active { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

  :host([type="primary"]) .widget,
  :host([type="primary"]) .widget:hover,
  :host([type="primary"]:focus) .widget,
  :host([type="primary"]) .widget:active,
  :host([type="danger"]) .widget,
  :host([type="danger"]) .widget:hover,
  :host([type="danger"]:focus) .widget,
  :host([type="danger"]) .widget:active,
  :host([type="warning"]) .widget,
  :host([type="warning"]) .widget:hover,
  :host([type="warning"]:focus) .widget,
  :host([type="warning"]) .widget:active,
  :host([type="success"]) .widget,
  :host([type="success"]) .widget:hover,
  :host([type="success"]:focus) .widget,
  :host([type="success"]) .widget:active { fill: #fff; color: #fff; }

  :host([type="primary"][outline]) .widget { fill: ${$colorPrimary}; color: ${$colorPrimary}; }
  :host([type="primary"][outline]) .widget:hover,
  :host([type="primary"][outline]:focus) .widget { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
  :host([type="primary"][outline]) .widget:active { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

  :host([type="danger"][outline]) .widget { fill: ${$colorDanger}; color: ${$colorDanger}; }
  :host([type="danger"][outline]) .widget:hover,
  :host([type="danger"][outline]:focus) .widget { fill: ${$colorDangerLight}; color: ${$colorDangerLight}; }
  :host([type="danger"][outline]) .widget:active { fill: ${$colorDangerDark}; color: ${$colorDangerDark}; }

  :host([type="warning"][outline]) .widget { fill: ${$colorWarning}; color: ${$colorWarning}; }
  :host([type="warning"][outline]) .widget:hover,
  :host([type="warning"][outline]:focus) .widget { fill: ${$colorWarningLight}; color: ${$colorWarningLight}; }
  :host([type="warning"][outline]) .widget:active { fill: ${$colorWarningDark}; color: ${$colorWarningDark}; }

  :host([type="success"][outline]) .widget { fill: ${$colorSuccess}; color: ${$colorSuccess}; }
  :host([type="success"][outline]) .widget:hover,
  :host([type="success"][outline]:focus) .widget { fill: ${$colorSuccessLight}; color: ${$colorSuccessLight}; }
  :host([type="success"][outline]) .widget:active { fill: ${$colorSuccessDark}; color: ${$colorSuccessDark}; }

  :host([type="link"]) .widget { fill: ${$colorPrimary}; color: ${$colorPrimary}; }
  :host([type="link"]) .widget:hover,
  :host([type="link"]:focus) .widget { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
  :host([type="link"]) .widget:active { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

  :host([disabled]) .widget,
  :host([disabled]) .widget:hover,
  :host([disabled]:focus) .widget,
  :host([disabled]) .widget:active,
  :host([disabled][outline]) .widget,
  :host([disabled][outline]) .widget:hover,
  :host([disabled][outline]:focus) .widget,
  :host([disabled][outline]) .widget:active { fill: ${$colorDisabled}; color: ${$colorDisabled}; }


  /* size */
  :host {
    height: ${$heightBase};
    font-size: 14px;
  }
  :host .label { margin: 0 7px; }
  :host .prefix-icon { margin-left: 7px; }
  :host .suffix-icon { margin-right: 7px; }

  :host([size="mini"]) {
    height: ${$heightMini};
    font-size: 12px;
  }
  :host([size="mini"]) .label { margin: 0 4px; }
  :host([size="mini"]) .prefix-icon { margin-left: 4px; }
  :host([size="mini"]) .suffix-icon { margin-right: 4px; }

  :host([size="small"]) {
    height: ${$heightSmall};
    font-size: 12px;
  }
  :host([size="small"]) .label { margin: 0 6px; }
  :host([size="small"]) .prefix-icon { margin-left: 6px; }
  :host([size="small"]) .suffix-icon { margin-right: 6px; }
  
  :host([size="large"]) {
    height: ${$heightLarge};
    font-size: 16px;
  }
  :host([size="large"]) .label { margin: 0 10px; }
  :host([size="large"]) .prefix-icon { margin-left: 10px; }
  :host([size="large"]) .suffix-icon { margin-right: 10px; }


  /* button group */
  :host-context(blocks-button-group) {
    position: relative;
    vertical-align: top;
  }
  :host-context(blocks-button-group):host(:hover),
  :host-context(blocks-button-group):host(:focus-within) {
    z-index: 1;
  }
  :host-context(blocks-button-group):host(:not(:first-of-type)) {
    margin-left: -1px;
  }
  :host-context(blocks-button-group) .widget {
    border-radius: 0;
  }
  :host-context(blocks-button-group):host(:first-of-type) .widget {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  :host-context(blocks-button-group):host(:last-of-type) .widget {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }  
</style>
<div class="widget">
  <span class="label"><slot></slot></span>
</div>
`

class BlocksButton extends HTMLElement {
  static get observedAttributes() {
    return [ 'type', 'size', 'disabled', 'prefix-icon', 'suffix-icon' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this._widget = shadowRoot.querySelector('.widget')
    this._label = shadowRoot.querySelector('.label')

    this.addEventListener('keydown', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (e.keyCode === 32 || e.keyCode === 13) {
        this.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true
          })
        )
      }
    })

    this.addEventListener('click', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopPropagation()
      }
    })

    this._observer = new MutationObserver(() => {
      this.setAttribute('aria-label', this.textContent)
    })
  }
  
  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get type() {
    return typeGetter(this)
  }

  set type(value) {
    typeSetter(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get prefixIcon() {
    return this.getAttribute('prefix-icon')
  }

  set prefixIcon(value) {
    this.setAttribute('prefix-icon', value)
  }

  get suffixIcon() {
    return this.getAttribute('suffix-icon')
  }

  set suffixIcon(value) {
    this.setAttribute('suffix-icon', value)
  }

  render() {
    const prefixIcon = getRegisteredSvgIcon(this.prefixIcon)
    if (prefixIcon) {
      if (this.prefixEl) {
        this._widget.removeChild(this.prefixEl)
      }
      this.prefixEl = this._widget.insertBefore(document.createElement('span'), this._label)
      this.prefixEl.className = 'prefix-icon'
      this.prefixEl.setAttribute('part', 'prefix')
      this.prefixEl.appendChild(prefixIcon)
    }

    const suffixIcon = getRegisteredSvgIcon(this.suffixIcon)
    if (suffixIcon) {
      if (this.suffixEl) {
        this._widget.removeChild(this.suffixEl)
      }
      this.suffixEl = this._widget.appendChild(document.createElement('span'))
      this.suffixEl.className = 'suffix-icon'
      this.suffixEl.setAttribute('part', 'suffix')
      this.suffixEl.appendChild(suffixIcon)
    }
  }

  connectedCallback() {
    setRole(this, 'button')
    setDisabled(this, this.disabled)
    setTabindex(this, !this.disabled)
    
    this._observer.observe(this, {
      childList: true,
      characterData: true,
      subtree: true
    })

    this.render()
  }

  disconnectedCallback() {
    this._observer.disconnect()
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'disabled') {
      setDisabled(this, this.disabled)
      setTabindex(this, !this.disabled)
    }
    this.render()
  }
}

if (!customElements.get('blocks-button')) {
  customElements.define('blocks-button', BlocksButton)
}
