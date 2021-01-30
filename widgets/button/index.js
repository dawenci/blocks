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

const TEMPLATE_CSS = `
<style>
:host {
  display: inline-block;
  border-width: 1px;
  border-style: solid;
  border-radius: ${$radiusBase};
  font-family: ${$fontFamily};
  cursor: pointer;
  text-align: center;
  transition: color ${$transitionDuration}, border-color ${$transitionDuration};
  user-select: none;
}
:host(:focus) {
  outline: 0 none;
}
:host([disabled]) {
  outline: 0 none;
  cursor: not-allowed;
}
:host([hidden]) {
  display: none;
}

.layout {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
:host,
:host(:hover),
:host(:active) { background-color: #fff; }

:host([type="primary"]) { background-color: ${$colorPrimary}; }
:host([type="primary"]:hover),
:host([type="primary"]:focus) { background-color: ${$colorPrimaryLight}; }
:host([type="primary"]:active) { background-color: ${$colorPrimaryDark}; }

:host([type="danger"]) { background-color: ${$colorDanger}; }
:host([type="danger"]:hover),
:host([type="danger"]:focus) { background-color: ${$colorDangerLight}; }
:host([type="danger"]:active) { background-color: ${$colorDangerDark}; }

:host([type="success"]) { background-color: ${$colorSuccess}; }
:host([type="success"]:hover),
:host([type="success"]:focus) { background-color: ${$colorSuccessLight}; }
:host([type="success"]:active) { background-color: ${$colorSuccessDark}; }

:host([type="warning"]) { background-color: ${$colorWarning}; }
:host([type="warning"]:hover),
:host([type="warning"]:focus) { background-color: ${$colorWarningLight}; }
:host([type="warning"]:active) { background-color: ${$colorWarningDark}; }

:host([disabled]),
:host([disabled]:hover),
:host([disabled]:focus),
:host([disabled]:active) { background-color: ${$backgroundColorDisabled}; }

:host([outline]),
:host([outline]:hover),
:host([outline]:focus),
:host([outline]:active) { background-color: transparent; }

:host([type="link"]),
:host([type="link"]:hover),
:host([type="link"]:focus),
:host([type="link"]:active) { background-color: transparent; }


/* border-color */
:host { border-color: ${$borderColorBase}; }
:host(:hover),
:host(:focus) { border-color: ${$colorPrimaryLight}; }
:host(:active) { border-color: ${$colorPrimaryDark}; }

:host([type="primary"]) { border-color: ${$colorPrimary}; }
:host([type="primary"]:hover),
:host([type="primary"]:focus) { border-color: ${$colorPrimaryLight}; }
:host([type="primary"]:active) {border-color: ${$colorPrimaryDark}; }

:host([type="danger"]) { border-color: ${$colorDanger}; }
:host([type="danger"]:hover),
:host([type="danger"]:focus) { border-color: ${$colorDangerLight}; }
:host([type="danger"]:active) { border-color: ${$colorDangerDark}; }

:host([type="warning"]) { border-color: ${$colorWarning}; }
:host([type="warning"]:hover),
:host([type="warning"]:focus) { border-color: ${$colorWarningLight}; }
:host([type="warning"]:active) { border-color: ${$colorWarningDark}; }

:host([type="success"]) { border-color: ${$colorSuccess}; }
:host([type="success"]:hover),
:host([type="success"]:focus) { border-color: ${$colorSuccessLight}; }
:host([type="success"]:active) { border-color: ${$colorSuccessDark}; }

:host([disabled]),
:host([disabled]:hover),
:host([disabled]:focus),
:host([disabled]:active) { border-color: ${$borderColorDisabled}; }

:host([type="link"]),
:host([type="link"]:hover),
:host([type="link"]:focus),
:host([type="link"]:active) { border-color: transparent; }


/* color */
:host { fill: ${$colorFontBase}; color: ${$colorFontBase}; }
:host(:hover),
:host(:focus) { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
:host(:active) { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

:host([type="primary"]),
:host([type="primary"]:hover),
:host([type="primary"]:focus),
:host([type="primary"]:active),
:host([type="danger"]),
:host([type="danger"]:hover),
:host([type="danger"]:focus),
:host([type="danger"]:active),
:host([type="warning"]),
:host([type="warning"]:hover),
:host([type="warning"]:focus),
:host([type="warning"]:active),
:host([type="success"]),
:host([type="success"]:hover),
:host([type="success"]:focus),
:host([type="success"]:active) { fill: #fff; color: #fff; }

:host([type="primary"][outline]) { fill: ${$colorPrimary}; color: ${$colorPrimary}; }
:host([type="primary"][outline]:hover),
:host([type="primary"][outline]:focus) { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
:host([type="primary"][outline]:active) { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

:host([type="danger"][outline]) { fill: ${$colorDanger}; color: ${$colorDanger}; }
:host([type="danger"][outline]:hover),
:host([type="danger"][outline]:focus) { fill: ${$colorDangerLight}; color: ${$colorDangerLight}; }
:host([type="danger"][outline]:active) { fill: ${$colorDangerDark}; color: ${$colorDangerDark}; }

:host([type="warning"][outline]) { fill: ${$colorWarning}; color: ${$colorWarning}; }
:host([type="warning"][outline]:hover),
:host([type="warning"][outline]:focus) { fill: ${$colorWarningLight}; color: ${$colorWarningLight}; }
:host([type="warning"][outline]:active) { fill: ${$colorWarningDark}; color: ${$colorWarningDark}; }

:host([type="success"][outline]) { fill: ${$colorSuccess}; color: ${$colorSuccess}; }
:host([type="success"][outline]:hover),
:host([type="success"][outline]:focus) { fill: ${$colorSuccessLight}; color: ${$colorSuccessLight}; }
:host([type="success"][outline]:active) { fill: ${$colorSuccessDark}; color: ${$colorSuccessDark}; }

:host([type="link"]) { fill: ${$colorPrimary}; color: ${$colorPrimary}; }
:host([type="link"]:hover),
:host([type="link"]:focus) { fill: ${$colorPrimaryLight}; color: ${$colorPrimaryLight}; }
:host([type="link"]:active) { fill: ${$colorPrimaryDark}; color: ${$colorPrimaryDark}; }

:host([disabled]),
:host([disabled]:hover),
:host([disabled]:focus),
:host([disabled]:active),
:host([disabled][outline]),
:host([disabled][outline]:hover),
:host([disabled][outline]:focus),
:host([disabled][outline]:active) { fill: ${$colorDisabled}; color: ${$colorDisabled}; }


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
:host-context(blocks-button-group) {
  border-radius: 0;
}
:host-context(blocks-button-group):host(:first-of-type) {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
:host-context(blocks-button-group):host(:last-of-type) {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>
`
const TEMPLATE_HTML = `
<div class="layout">
  <span class="label"><slot></slot></span>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksButton extends HTMLElement {
  static get observedAttributes() {
    return [ 'type', 'size', 'disabled', 'prefix-icon', 'suffix-icon' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.querySelector('.layout')
    this.$label = shadowRoot.querySelector('.label')

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
      if (this.$prefix) {
        this.$layout.removeChild(this.$prefix)
      }
      this.$prefix = this.$layout.insertBefore(document.createElement('span'), this.$label)
      this.$prefix.className = 'prefix-icon'
      this.$prefix.setAttribute('part', 'prefix')
      this.$prefix.appendChild(prefixIcon)
    }

    const suffixIcon = getRegisteredSvgIcon(this.suffixIcon)
    if (suffixIcon) {
      if (this.$suffix) {
        this.$layout.removeChild(this.$suffix)
      }
      this.$suffix = this.$layout.appendChild(document.createElement('span'))
      this.$suffix.className = 'suffix-icon'
      this.$suffix.setAttribute('part', 'suffix')
      this.$suffix.appendChild(suffixIcon)
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
