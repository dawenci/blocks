import { upgradeProperty } from '../../common/upgradeProperty.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, numGetter, numSetter } from '../../common/property.js'
import { makeRgbaColor } from '../../common/utils.js';
import { $colorDanger, $colorPrimary, $colorSuccess, $colorWarning, $radiusBase, $transitionDuration } from '../theme/var.js'

const valueGetter = numGetter('value')
const valueSetter = numSetter('value')
const percentageGetter = boolGetter('percentage')
const percentageSetter = boolSetter('percentage')
const status = [null, 'success', 'error', 'warning']
const statusGetter = enumGetter('status', status)
const statusSetter = enumSetter('status', status)

const TEMPLATE_CSS = `<style>
:host {
  display: block;
  box-sizing: border-box;
  position: relative;
  height: 5px;
}
#layout {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 1px;
}
#track {
  flex: 1 1 100%;
  box-sizing: border-box;
  height: 100%;
  border-radius: ${$radiusBase};
}
#progress {
  width: 0;
  height: 100%;
  transition: ${$transitionDuration} all;
  border-radius: ${$radiusBase};
}
#value {
  flex: 0 0 auto;
  box-sizing: border-box;
  height: 16px;
  margin-left: 5px;
  line-height: 16px;
  font-size: 12px;
  text-shadow: 1px 1px 0 rgba(255,255,255,.5);
}

#track { background-color: ${makeRgbaColor($colorPrimary, .1)} }
#progress { background-color: ${$colorPrimary} }
#value { color: ${$colorPrimary} }

:host([status="success"]) #track { background-color: ${makeRgbaColor($colorSuccess, .1)} }
:host([status="success"]) #progress { background-color: ${$colorSuccess} }
:host([status="success"]) #value { color: ${$colorSuccess} }

:host([status="error"]) #track { background-color: ${makeRgbaColor($colorDanger, .1)} }
:host([status="error"]) #progress { background-color: ${$colorDanger} }
:host([status="error"]) #value { color: ${$colorDanger} }

:host([status="warning"]) #track { background-color: ${makeRgbaColor($colorWarning, .1)} }
:host([status="warning"]) #progress { background-color: ${$colorWarning} }
:host([status="warning"]) #value { color: ${$colorWarning} }
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <div id="track">
    <div id="progress" part="progress"></div>
  </div>
  <div id="value" part="value"></div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksProgress extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'status', 'percentage']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$progress = shadowRoot.querySelector('#progress')
    this.$value = shadowRoot.querySelector('#value')
  }

  get value() {
    return valueGetter(this)
  }

  set value(value) {
    valueSetter(this, value)
  }

  get status() {
    return statusGetter(this)
  }

  set status(value) {
    statusSetter(this, value)
  }

  get percentage() {
    return percentageGetter(this)
  }

  set percentage(value) {
    percentageSetter(this, value)
  }

  render() {
    this.$progress.style.width = `${this.value}%`
    if (this.percentage) {
      this.$value.style.display = 'block'
      this.$value.textContent = `${this.value}%`
    }
    else {
      this.$value.style.display = 'none'
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

if (!customElements.get('blocks-progress')) {
  customElements.define('blocks-progress', BlocksProgress)
}
