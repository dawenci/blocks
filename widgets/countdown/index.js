import { padLeft } from '../core/utils.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { numGetter, numSetter } from '../core/property.js'

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
</style>`

const TEMPLATE_HTML = `
<div class="widget"></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksCountdown extends HTMLElement {
  static get observedAttributes() {
    return ['format', 'value']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this._widget = shadowRoot.querySelector('.widget')
  }

  // timestamp
  get value() {
    return numGetter('value')(this)
  }

  set value(value) {
    numSetter('value')(this, value)
  }

  get format() {
    return this.getAttribute('format') || 'YYYY:MM:DD'
  }

  set format(value) {
    this.setAttribute('format', value)
  }

  get shouldShowDay() {
    return this.format.includes('DD') || this.format.includes('D')
  }

  get shouldShowHour() {
    return this.format.includes('HH') || this.format.includes('H')
  }

  get shouldShowMinute() {
    return this.format.includes('mm') || this.format.includes('m')
  }

  get shouldShowSecond() {
    return this.format.includes('ss') || this.format.includes('s')
  }

  get shouldShowMs() {
    return this.format.includes('SSS')
  }

  padHour(h) {
    return this.format.includes('HH') ? padLeft('0', 2, h) : h
  }

  padMin(m) {
    return this.format.includes('mm') ? padLeft('0', 2, m) : m
  }

  padSec(s) {
    return this.format.includes('ss') ? padLeft('0', 2, s) : s
  }

  render() {
    const deadline = this.value
    const now = Date.now()
    let d = 0
    let h = 0
    let m = 0
    let s = 0
    let ms = deadline - now
    if (ms >= 0) {
      if (this.shouldShowDay) {
        d = Math.floor(ms / 86400000)
        ms %= 86400000
      }
      if (this.shouldShowHour) {
        h = Math.floor(ms / 3600000)
        ms %= 3600000
      }
      if (this.shouldShowMinute) {
        m = Math.floor(ms / 60000)
        ms %= 60000
      }
      if (this.shouldShowSecond) {
        s = Math.floor(ms / 1000)
        ms %= 1000
      }
      // TODO, month, year
    }
    else {
      this.dispatchEvent(new CustomEvent('finish', { bubbles: true, composed: true, cancelable: true }))
    }

    let content = this.format
    content = content.replace(/D+/, d)
    content = content.replace(/H+/, this.padHour(h))
    content = content.replace(/m+/, this.padMin(m))
    content = content.replace(/s+/, this.padSec(s))
    content = content.replace(/SSS/, ms)

    if (this._widget.textContent !== content) {
      this._widget.textContent = content
    }
  }

  _loop() {
    this._timer = requestAnimationFrame(() => {
      this.render()
      this._loop()
    })
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this._loop()
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._timer)
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
  }
}

if (!customElements.get('blocks-countdown')) {
  customElements.define('blocks-countdown', BlocksCountdown)
}
