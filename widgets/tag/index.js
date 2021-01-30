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
import { dispatchEvent } from '../core/event.js'

const closeableGetter = boolGetter('closeable')
const closeableSetter = boolSetter('closeable')
const outlineGetter = boolGetter('outline')
const outlineSetter = boolSetter('outline')

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  border-radius: ${$radiusBase};
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  text-align: center;
  transition: color ${$transitionDuration}, border-color ${$transitionDuration};
  user-select: none;
  font-family: ${$fontFamily};
}

#layout {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

#label   {
  flex: 1 1 100%;
  display: block;
  height: 16px;
  line-height: 16px;
  box-sizing: border-box;
  white-space: nowrap;
}

#close {
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
#close:focus {
  outline: 0 none;
}
#close::before,
#close::after {
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
#close::before {
  width: 8px;
}
#close::after {
  height: 8px;
}


/* background */
:host { background-color: #fff; }
:host([type="primary"]) { background-color: ${$colorPrimary}; }
:host([type="danger"]) { background-color: ${$colorDanger}; }
:host([type="success"]) { background-color: ${$colorSuccess}; }
:host([type="warning"]) { background-color: ${$colorWarning}; }
:host([outline]) { background-color: transparent; }


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


/* close color */
#close::before,
#close::after { background: #ddd; }
#close:hover { border-color: #ccc; }
#close:hover::before,
#close:hover::after { background: #ccc; }

:host([type="primary"]) #close::before,
:host([type="primary"]) #close::after,
:host([type="danger"]) #close::before,
:host([type="danger"]) #close::after,
:host([type="warning"]) #close::before,
:host([type="warning"]) #close::after,
:host([type="success"]) #close::before,
:host([type="success"]) #close::after { background-color: #fff; }
:host([type="primary"]) #close:hover,
:host([type="danger"]) #close:hover,
:host([type="warning"]) #close:hover,
:host([type="success"]) #close:hover { border-color: #fff; }

:host([type="primary"][outline]) #close::before,
:host([type="primary"][outline]) #close::after { background-color: ${$colorPrimary} }
:host([type="primary"][outline]) #close:hover { border-color: ${$colorPrimary} }

:host([type="danger"][outline]) #close::before,
:host([type="danger"][outline]) #close::after { background-color: ${$colorDanger} }
:host([type="danger"][outline]) #close:hover { border-color: ${$colorDanger} }

:host([type="warning"][outline]) #close::before,
:host([type="warning"][outline]) #close::after { background-color: ${$colorWarning} }
:host([type="warning"][outline]) #close:hover { border-color: ${$colorWarning} }

:host([type="success"][outline]) #close::before,
:host([type="success"][outline]) #close::after { background-color: ${$colorSuccess} }
:host([type="success"][outline]) #close:hover { border-color: ${$colorSuccess} }


/* size */
:host {
  height: ${$heightBase};
  font-size: 14px;
}
:host #label { margin: 0 7px; }

:host([size="mini"]) {
  height: ${$heightMini};
  font-size: 12px;
}
:host([size="mini"]) #label { margin: 0 4px; }

:host([size="small"]) {
  height: ${$heightSmall};
  font-size: 12px;
}
:host([size="small"]) #label { margin: 0 6px; }

:host([size="large"]) {
  height: ${$heightLarge};
  font-size: 16px;
}
:host([size="large"]) #label { margin: 0 10px; }
</style>`

const TEMPLATE_HTML = `
<div id="layout"><span id="label"><slot></slot></span></div>
`

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
    this.$layout = shadowRoot.getElementById('layout')

    this.shadowRoot.addEventListener('click', e => {
      if (e.target.id === 'close') {
        dispatchEvent(this, 'close')
      }
    })
  }

  get closeable() {
    return closeableGetter(this)
  }

  set closeable(value) {
    closeableSetter(this, value)
    this.render()
  }

  get outline() {
    return outlineGetter(this)
  }

  set outline(value) {
    outlineSetter(this, value)
    this.render()
  }

  render() {
    if (this.closeable) {
      if (!this.shadowRoot.getElementById('close')) {
        const button = this.$layout.appendChild(document.createElement('button'))
        button.id = 'close'
      }
    }
    else {
      const button = this.shadowRoot.getElementById('close')
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

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
  }
}

if (!customElements.get('blocks-tag')) {
  customElements.define('blocks-tag', BlocksTag)
}
