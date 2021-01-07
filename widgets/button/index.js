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

import { getIconSvg } from '../theme/icon.js'

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

  .container {
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
  :host .container,
  :host(:hover) .container,
  :host(:active) .container { background-color: #fff; }

  :host([type="primary"]) .container { background-color: ${$colorPrimary}; }
  :host([type="primary"]:hover) .container,
  :host([type="primary"]:focus) .container { background-color: ${$colorPrimaryLight}; }
  :host([type="primary"]:active) .container { background-color: ${$colorPrimaryDark}; }

  :host([type="danger"]) .container { background-color: ${$colorDanger}; }
  :host([type="danger"]:hover) .container,
  :host([type="danger"]:focus) .container { background-color: ${$colorDangerLight}; }
  :host([type="danger"]:active) .container { background-color: ${$colorDangerDark}; }

  :host([type="success"]) .container { background-color: ${$colorSuccess}; }
  :host([type="success"]:hover) .container,
  :host([type="success"]:focus) .container { background-color: ${$colorSuccessLight}; }
  :host([type="success"]:active) .container { background-color: ${$colorSuccessDark}; }

  :host([type="warning"]) .container { background-color: ${$colorWarning}; }
  :host([type="warning"]:hover) .container,
  :host([type="warning"]:focus) .container { background-color: ${$colorWarningLight}; }
  :host([type="warning"]:active) .container { background-color: ${$colorWarningDark}; }

  :host([disabled]) .container,
  :host([disabled]:hover) .container,
  :host([disabled]:focus) .container,
  :host([disabled]:active) .container { background-color: ${$backgroundColorDisabled}; }

  :host([outline]) .container,
  :host([outline]:hover) .container,
  :host([outline]:focus) .container,
  :host([outline]:active) .container { background-color: transparent; }

  :host([type="link"]),
  :host([type="link"]:hover) .container,
  :host([type="link"]:focus) .container,
  :host([type="link"]:active) .container { background-color: transparent; }


  /* border-color */
  :host .container { border-color: ${$borderColorBase}; }
  :host(:hover) .container,
  :host(:focus) .container { border-color: ${$colorPrimaryLight}; }
  :host(:active) .container { border-color: ${$colorPrimaryDark}; }

  :host([type="primary"]) .container { border-color: ${$colorPrimary}; }
  :host([type="primary"]:hover) .container,
  :host([type="primary"]:focus) .container { border-color: ${$colorPrimaryLight}; }
  :host([type="primary"]:active) .container {border-color: ${$colorPrimaryDark}; }

  :host([type="danger"]) .container { border-color: ${$colorDanger}; }
  :host([type="danger"]:hover) .container,
  :host([type="danger"]:focus) .container { border-color: ${$colorDangerLight}; }
  :host([type="danger"]:active) .container { border-color: ${$colorDangerDark}; }

  :host([type="warning"]) .container { border-color: ${$colorWarning}; }
  :host([type="warning"]:hover) .container,
  :host([type="warning"]:focus) .container { border-color: ${$colorWarningLight}; }
  :host([type="warning"]:active) .container { border-color: ${$colorWarningDark}; }

  :host([type="success"]) .container { border-color: ${$colorSuccess}; }
  :host([type="success"]:hover) .container,
  :host([type="success"]:focus) .container { border-color: ${$colorSuccessLight}; }
  :host([type="success"]:active) .container { border-color: ${$colorSuccessDark}; }
  
  :host([disabled]) .container,
  :host([disabled]:hover) .container,
  :host([disabled]:focus) .container,
  :host([disabled]:active) .container { border-color: ${$borderColorDisabled}; }

  :host([type="link"]) .container,
  :host([type="link"]:hover) .container,
  :host([type="link"]:focus) .container,
  :host([type="link"]:active) .container { border-color: transparent; }


  /* color */
  :host .container { fill: ${$colorFontBase}; color: ${$colorFontBase}; }
  :host(:hover) .container,
  :host(:focus) .container { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
  :host(:active) .container { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

  :host([type="primary"]) .container,
  :host([type="primary"]:hover) .container,
  :host([type="primary"]:focus) .container,
  :host([type="primary"]:active) .container,
  :host([type="danger"]) .container,
  :host([type="danger"]:hover) .container,
  :host([type="danger"]:focus) .container,
  :host([type="danger"]:active) .container,
  :host([type="warning"]) .container,
  :host([type="warning"]:hover) .container,
  :host([type="warning"]:focus) .container,
  :host([type="warning"]:active) .container,
  :host([type="success"]) .container,
  :host([type="success"]:hover) .container,
  :host([type="success"]:focus) .container,
  :host([type="success"]:active) .container { fill: #fff; color: #fff; }

  :host([type="primary"][outline]) .container { fill: ${$colorPrimary}; color: ${$colorPrimary}; }
  :host([type="primary"][outline]:hover) .container,
  :host([type="primary"][outline]:focus) .container { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
  :host([type="primary"][outline]:active) .container { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

  :host([type="danger"][outline]) .container { fill: ${$colorDanger}; color: ${$colorDanger}; }
  :host([type="danger"][outline]:hover) .container,
  :host([type="danger"][outline]:focus) .container { fill: ${$colorDangerLight}; color: ${$colorDangerLight}; }
  :host([type="danger"][outline]:active) .container { fill: ${$colorDangerDark}; color: ${$colorDangerDark}; }

  :host([type="warning"][outline]) .container { fill: ${$colorWarning}; color: ${$colorWarning}; }
  :host([type="warning"][outline]:hover) .container,
  :host([type="warning"][outline]:focus) .container { fill: ${$colorWarningLight}; color: ${$colorWarningLight}; }
  :host([type="warning"][outline]:active) .container { fill: ${$colorWarningDark}; color: ${$colorWarningDark}; }

  :host([type="success"][outline]) .container { fill: ${$colorSuccess}; color: ${$colorSuccess}; }
  :host([type="success"][outline]:hover) .container,
  :host([type="success"][outline]:focus) .container { fill: ${$colorSuccessLight}; color: ${$colorSuccessLight}; }
  :host([type="success"][outline]:active) .container { fill: ${$colorSuccessDark}; color: ${$colorSuccessDark}; }

  :host([type="link"]) .container { fill: ${$colorPrimary}; color: ${$colorPrimary}; }
  :host([type="link"]:hover) .container,
  :host([type="link"]:focus) .container { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
  :host([type="link"]:active) .container { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

  :host([disabled]) .container,
  :host([disabled]:hover) .container,
  :host([disabled]:focus) .container,
  :host([disabled]:active) .container,
  :host([disabled][outline]) .container,
  :host([disabled][outline]:hover) .container,
  :host([disabled][outline]:focus) .container,
  :host([disabled][outline]:active) .container { fill: ${$colorDisabled}; color: ${$colorDisabled}; }


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
</style>
<div class="container">
  <span class="label"><slot></slot></span>
</div>
`

class BlocksButton extends HTMLElement {
  static get observedAttributes() {
    return [ 'disabled' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.label = shadowRoot.querySelector('.label')

    this.addEventListener('keydown', (e) => {
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

  get prefixIcon() {
    return this.getAttribute('prefix-icon')
  }

  set prefixIcon(value) {
    this.setAttribute('prefix-icon', value)
    this.render()
  }

  get suffixIcon() {
    return this.getAttribute('suffix-icon')
  }

  set suffixIcon(value) {
    this.setAttribute('suffix-icon', value)
    this.render()
  }

  render() {
    const prefixIcon = getIconSvg(this.prefixIcon)
    if (prefixIcon) {
      if (this.prefixEl) {
        this.shadowRoot.querySelector('.container').removeChild(this.prefixEl)
      }
      this.prefixEl = this.shadowRoot.querySelector('.container').insertBefore(document.createElement('span'), this.label)
      this.prefixEl.className = 'prefix-icon'
      this.prefixEl.setAttribute('part', 'prefix')
      this.prefixEl.appendChild(prefixIcon)
    }

    const suffixIcon = getIconSvg(this.suffixIcon)
    if (suffixIcon) {
      if (this.suffixEl) {
        this.shadowRoot.querySelector('.container').removeChild(this.suffixEl)
      }
      this.suffixEl = this.shadowRoot.querySelector('.container').appendChild(document.createElement('span'))
      this.suffixEl.className = 'suffix-icon'
      this.suffixEl.setAttribute('part', 'suffix')
      this.suffixEl.appendChild(suffixIcon)
    }
  }

  connectedCallback() {
    this.setAttribute('role', 'button')
    this.setAttribute('tabindex', '0')
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
    // only is called for the disabled attribute due to observedAttributes
    if (this.disabled) {
      this.removeAttribute('tabindex')
      this.setAttribute('aria-disabled', 'true')
    }
    else {
      this.setAttribute('tabindex', '0')
      this.setAttribute('aria-disabled', 'false')
    }

    this.render()
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
}

if (!customElements.get('blocks-button')) {
  customElements.define('blocks-button', BlocksButton)
}
