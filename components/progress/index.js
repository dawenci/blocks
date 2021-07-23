import { upgradeProperty } from '../../common/upgradeProperty.js'
import { rgbaFromHex } from '../../common/color.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, numGetter, numSetter } from '../../common/property.js'
import { __color_danger, __color_primary, __color_success, __color_warning, __radius_base, __transition_duration } from '../../theme/var.js'

const valueGetter = numGetter('value')
const valueSetter = numSetter('value')
const percentageGetter = boolGetter('percentage')
const percentageSetter = boolSetter('percentage')
const status = [null, 'success', 'error', 'warning']
const statusGetter = enumGetter('status', status)
const statusSetter = enumSetter('status', status)

const TEMPLATE_CSS = `<style>
@keyframes light {
  0% {
    transform: scale(0, 1);
    opacity: .3;
  }
  25% {
    transform: scale(0, 1);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  75% {
    transform: scale(1, 1);
    opacity: 0;
  }
  100% {
    transform: scale(1, 1);
    opacity: 0;
  }
}
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
  border-radius: var(--radius-base, ${__radius_base});
}
#progress {
  position: relative;
  width: 0;
  height: 100%;
  transition: var(--transition-duration, ${__transition_duration}) all;
  border-radius: var(--radius-base, ${__radius_base});
}
#progress:after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,.2);
  animation: 2s linear infinite light;
  transform-origin: left top;
}
:host([value="100"]) #progress:after {
  animation: none;
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

#track { background-color: ${rgbaFromHex(__color_primary, .1)} }
#progress { background-color: var(--color-primary, ${__color_primary}) }
#value { color: var(--color-primary, ${__color_primary}) }

:host([status="success"]) #track { background-color: ${rgbaFromHex(__color_success, .1)} }
:host([status="success"]) #progress { background-color: var(--color-success, ${__color_success}) }
:host([status="success"]) #value { color: var(--color-success, ${__color_success}) }

:host([status="error"]) #track { background-color: ${rgbaFromHex(__color_danger, .1)} }
:host([status="error"]) #progress { background-color: var(--color-danger, ${__color_danger}) }
:host([status="error"]) #value { color: var(--color-danger, ${__color_danger}) }

:host([status="warning"]) #track { background-color: ${rgbaFromHex(__color_warning, .1)} }
:host([status="warning"]) #progress { background-color: var(--color-warning, ${__color_warning}) }
:host([status="warning"]) #value { color: var(--color-warning, ${__color_warning}) }
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

export class BlocksProgress extends HTMLElement {
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

if (!customElements.get('bl-progress')) {
  customElements.define('bl-progress', BlocksProgress)
}
