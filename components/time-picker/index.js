import '../popup/index.js'
import '../input/index.js'
import '../time/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { __height_base } from '../theme/var.js'
import { padLeft } from '../../common/utils.js'

let idSeed = Date.now()

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  width: calc(var(--height-base, ${__height_base}) * 3 + 12px * 3);
  height: 32px;
  user-select: none;
  cursor: default;
}

:host(:focus) {
  outline: 0 none;
}

#result {
  width: 100%;
}
</style>`

const TEMPLATE_HTML_INPUT = `<bl-input suffix-icon="time" id="result" readonly />`

const TEMPLATE_HTML_POPUP = `
<bl-popup append-to-body class="time-picker-popup" origin="top-start" arrow autoflip>
  <bl-time class="time-picker-panel"></bl-time>
  <div id="action" style="padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

class BlocksTimePicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'clearable',
      'disabled',
      'hour',
      'minute',
      'second',
      'size',
    ]
  }

  constructor() {
    super()
    this.id = `time-picker-${idSeed++}`

    this.attachShadow({ mode: 'open' })

    // input 部分
    const fragment = inputTemplate.content.cloneNode(true)
    this.$input = fragment.querySelector('#result')
    this.shadowRoot.appendChild(fragment)

    // 面板部分
    this.$popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup')
    this.$panel = this.$popup.querySelector('bl-time')
    this.$popup.setAttribute('anchor', `#${this.id}`)

    this.$input.onfocus = this.$input.onclick = (e) => {
      this.$popup.open = true
    }

    this.$input.addEventListener('click-clear', () => {
      this.hour = this.minute = this.second = null
    })

    this.$panel.addEventListener('change', (e) => {
      Object.assign(this, e.detail)
      this.render()
    })

    this.$popup.addEventListener('open', () => {
      this._initClickOutside()
    })

    this.$popup.addEventListener('close', () => {
      this._destroyClickOutside()
    })
  }

  get clearable() {
    return this.$input.clearable
  }

  set clearable(value) {
    this.$input.clearable = value
  }

  get disabled() {
    return this.$panel.disabled
  }

  set disabled(value) {
    this.$panel.disabled = value
  }

  get hour() {
    return this.$panel.hour
  }

  set hour(value) {
    this.$panel.hour = value
  }

  get minute() {
    return this.$panel.minute
  }

  set minute(value) {
    this.$panel.minute = value
  }

  get second() {
    return this.$panel.second
  }

  set second(value) {
    this.$panel.second = value
  }

  get value() {
    return this.$input.value
  }

  set value(value) {
    this.$input.value = value
  }
  
  render() {
    if ([this.hour, this.minute, this.second].some(v => Object.is(v, NaN) || v == null)) {
      this.value = ''
      return
    }
    this.value = `${padLeft('0', 2, this.hour)}:${padLeft('0', 2, this.minute)}:${padLeft('0', 2, this.second)}`
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach((attr) => {
      upgradeProperty(this, attr)
    })
    document.body.appendChild(this.$popup)

    this.render()
  }

  disconnectedCallback() {
    document.body.removeChild(this.$popup)
    this._destroyClickOutside()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (['clearable'].includes(name)) {
      this.$input.setAttribute(name, newValue)
    }
    if (['depth', 'mindepth', 'startdepth', 'multiple', 'max', 'loading', 'start-week-on'].includes(name)) {
      this.$panel.setAttribute(name, newValue)
    }
    this.render()
  }

  _initClickOutside() {
    if (!this._clearClickOutside) {
      this._clearClickOutside = onClickOutside([this, this.$panel], () => {
        if (this.$popup.open) this.$popup.open = false
      })
    }
  }

  _destroyClickOutside() {
    if (this._clearClickOutside) {
      this._clearClickOutside()
      this._clearClickOutside = undefined
    }
  }
}

if (!customElements.get('bl-time-picker')) {
  customElements.define('bl-time-picker', BlocksTimePicker)
}
