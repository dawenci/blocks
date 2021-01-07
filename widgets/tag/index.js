import { boolGetter, boolSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import {
  $borderColorBase,
  $heightBase,
  $heightMini,
  $heightSmall,
  $heightLarge,
  $radiusBase,
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
} from '../theme/var.js'

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
  border-radius: ${$radiusBase};
}

:host .label {
  flex: 1 1 100%;
}
:host .close {
  display: none;
  flex: 0 0 auto;
  position: relative;
  width: 16px;
  height: 16px;
  margin: 0 0 0 6px;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  transform: rotate(45deg);
  border-radius: 50%;
}
:host .close:focus {
  outline: 0 none;
}
:host([closable]) .close {
  display: block;
}
:host([closable]) .close:hover {
  display: block;
  border: 1px solid #ccc;
}
:host([closable]) .close:hover::before,
:host([closable]) .close:hover::after {
  background: #ccc;
}
:host .close::before,
:host .close::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  content: '';
  width: 2px;
  height: 2px;
  margin: auto;
  background: #ddd;
}
:host .close::before {
  width: 8px;
}
:host .close::after {
  height: 8px;
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

:host([outline]),
:host([outline]:hover),
:host([outline]:focus),
:host([outline]:active) { background-color: transparent; }


/* border-color */
:host { border-color: ${$borderColorBase}; }
:host([type="primary"]) { border-color: ${$colorPrimary}; }
:host([type="danger"]) { border-color: ${$colorDanger}; }
:host([type="warning"]) { border-color: ${$colorWarning}; }
:host([type="success"]) { border-color: ${$colorSuccess}; }


/* color */
:host([type="primary"]),
:host([type="danger"]),
:host([type="warning"]),
:host([type="success"]) { color: #fff; }
:host([type="primary"][outline]) { color: ${$colorPrimary} }
:host([type="danger"][outline]) { color: ${$colorDanger} }
:host([type="warning"][outline]) { color: ${$colorWarning} }
:host([type="success"][outline])  { color: ${$colorSuccess} }

/* size */
:host {
  height: ${$heightBase};
  line-height: calc(${$heightBase} - 2px);
  padding: 0 ${parseInt($heightBase, 10) / 4}px;
  font-size: 14px;
}
:host([size="mini"]) {
  height: ${$heightMini};
  line-height: calc(${$heightMini} - 2px);
  padding: 0 ${parseInt($heightMini, 10) / 4}px;
  font-size: 12px;
}
:host([size="small"]) {
  height: ${$heightSmall};
  line-height: calc(${$heightSmall} - 2px);
  padding: 0 ${parseInt($heightSmall, 10) / 4}px;
  font-size: 12px;
}
:host([size="large"]) {
  height: ${$heightLarge};
  line-height: calc(${$heightLarge} - 2px);
  font-size: 16px;
  padding: 0 ${parseInt($heightLarge, 10) / 4}px;
}
</style>`

const TEMPLATE_HTML = `<span class="label"><slot></slot></span>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksTag extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.shadowRoot.addEventListener('click', e => {
      if (e.target.classList.contains('close')) {
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true, cancelable: true }))
      }
    })
  }

  get closable() {
    return boolGetter('closable')(this)
  }

  set closable(value) {
    boolSetter('closable')(this, value)
    this.render()
  }

  get outline() {
    return boolGetter('outline')(this)
  }

  set outline(value) {
    boolSetter('outline')(this, value)
    this.render()
  }

  render() {
    if (this.closable) {
      if (!this.shadowRoot.querySelector('.close')) {
        const button = this.shadowRoot.appendChild(document.createElement('button'))
        button.className = 'close'
      }
    }
    else {
      const button = this.shadowRoot.querySelector('.close')
      if (button) {
        button.parentElement.removeChild(button)
      }
    }
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
  }
}

if (!customElements.get('blocks-tag')) {
  customElements.define('blocks-tag', BlocksTag)
}
