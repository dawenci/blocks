import { boolGetter, boolSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import {
  $fontFamily,
  $borderColorBase,
  $heightBase,
  $heightMini,
  $heightSmall,
  $heightLarge,
  $radiusBase,
  $colorPrimary,
  $colorDanger,
  $colorSuccess,
  $colorWarning,
  $transitionDuration,
} from '../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
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

.label {
  flex: 1 1 100%;
  display: block;
  height: 16px;
  line-height: 16px;
  box-sizing: border-box;
  white-space: nowrap;
}

.close {
  flex: 0 0 auto;
  position: relative;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  margin: 0 6px 0 -2px;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  transform: rotate(45deg);
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  transition: transform ${$transitionDuration};
}
.close:focus {
  outline: 0 none;
}
.close::before,
.close::after {
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
}
.close::before {
  width: 8px;
}
.close::after {
  height: 8px;
}


/* background */
:host .container { background-color: #fff; }
:host([type="primary"]) .container { background-color: ${$colorPrimary}; }
:host([type="danger"]) .container { background-color: ${$colorDanger}; }
:host([type="success"]) .container { background-color: ${$colorSuccess}; }
:host([type="warning"]) .container { background-color: ${$colorWarning}; }
:host([outline]) .container { background-color: transparent; }


/* border-color */
:host .container { border-color: ${$borderColorBase}; }
:host([type="primary"]) .container { border-color: ${$colorPrimary}; }
:host([type="danger"]) .container { border-color: ${$colorDanger}; }
:host([type="warning"]) .container { border-color: ${$colorWarning}; }
:host([type="success"]) .container { border-color: ${$colorSuccess}; }


/* color */
:host([type="primary"]),
:host([type="danger"]),
:host([type="warning"]),
:host([type="success"]) { color: #fff; }
:host([type="primary"][outline]) { color: ${$colorPrimary} }
:host([type="danger"][outline]) { color: ${$colorDanger} }
:host([type="warning"][outline]) { color: ${$colorWarning} }
:host([type="success"][outline])  { color: ${$colorSuccess} }


/* close color */
.close::before,
.close::after { background: #ddd; }
.close:hover { border-color: #ccc; }
.close:hover::before,
.close:hover::after { background: #ccc; }

:host([type="primary"]) .close::before,
:host([type="primary"]) .close::after,
:host([type="danger"]) .close::before,
:host([type="danger"]) .close::after,
:host([type="warning"]) .close::before,
:host([type="warning"]) .close::after,
:host([type="success"]) .close::before,
:host([type="success"]) .close::after { background-color: #fff; }
:host([type="primary"]) .close:hover,
:host([type="danger"]) .close:hover,
:host([type="warning"]) .close:hover,
:host([type="success"]) .close:hover { border-color: #fff; }

:host([type="primary"][outline]) .close::before,
:host([type="primary"][outline]) .close::after { background-color: ${$colorPrimary} }
:host([type="primary"][outline]) .close:hover { border-color: ${$colorPrimary} }

:host([type="danger"][outline]) .close::before,
:host([type="danger"][outline]) .close::after { background-color: ${$colorDanger} }
:host([type="danger"][outline]) .close:hover { border-color: ${$colorDanger} }

:host([type="warning"][outline]) .close::before,
:host([type="warning"][outline]) .close::after { background-color: ${$colorWarning} }
:host([type="warning"][outline]) .close:hover { border-color: ${$colorWarning} }

:host([type="success"][outline]) .close::before,
:host([type="success"][outline]) .close::after { background-color: ${$colorSuccess} }
:host([type="success"][outline]) .close:hover { border-color: ${$colorSuccess} }


/* size */
:host {
  height: ${$heightBase};
  font-size: 14px;
}
:host .label { margin: 0 7px; }

:host([size="mini"]) {
  height: ${$heightMini};
  font-size: 12px;
}
:host([size="mini"]) .label { margin: 0 4px; }

:host([size="small"]) {
  height: ${$heightSmall};
  font-size: 12px;
}
:host([size="small"]) .label { margin: 0 6px; }

:host([size="large"]) {
  height: ${$heightLarge};
  font-size: 16px;
}
:host([size="large"]) .label { margin: 0 10px; }
</style>`

const TEMPLATE_HTML = `
<div class="container">
  <span class="label"><slot></slot></span>
</div>`

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
        const button = this.shadowRoot.querySelector('.container').appendChild(document.createElement('button'))
        button.className = 'close'
      }
    }
    else {
      const button = this.shadowRoot.querySelector('.container').querySelector('.close')
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
