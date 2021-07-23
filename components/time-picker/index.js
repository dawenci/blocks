import '../popup/index.js'
import { BlocksInput } from '../input/index.js'
import { BlocksTime } from '../time/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { __fg_placeholder, __height_base } from '../../theme/var.js'
import { padLeft } from '../../common/utils.js'
import { boolSetter, intRangeGetter, intRangeSetter } from '../../common/property.js'
import { dispatchEvent } from '../../common/event.js'

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

:host([popup-open]) #result {
  color: var(--fg-placeholder, ${__fg_placeholder});
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

export class BlocksTimePicker extends HTMLElement {
  static get observedAttributes() {
    return BlocksTime.observedAttributes.concat(BlocksInput.observedAttributes)
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    // input 部分
    const fragment = inputTemplate.content.cloneNode(true)
    this.$input = fragment.querySelector('#result')
    this.shadowRoot.appendChild(fragment)

    // 面板部分
    this.$popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup')
    this.$time = this.$popup.querySelector('bl-time')
    this.$popup.anchor = () => this.$input

    this.$input.onfocus = this.$input.onclick = (e) => {
      this.$time.scrollToActive()
      this.$popup.open = true
    }

    this.$input.addEventListener('click-clear', () => {
      this.$time.clear()
      this._prevValue = {
        hour: null,
        minute: null,
        second: null,
      }
    })

    this.$time.addEventListener('change', (e) => {
      this.render()
    })

    this.$popup.addEventListener('open-changed', () => {
      boolSetter('popup-open')(this, this.$popup.open)
    })

    this.$popup.addEventListener('opened', () => {
      this._prevValue = {
        hour: this.$time.hour,
        minute: this.$time.minute,
        second: this.$time.second,
      }
      this._initClickOutside()
    })

    this.$popup.addEventListener('closed', () => {
      if (this._prevValue) {
        this.$time.hour = this._prevValue.hour
        this.$time.minute = this._prevValue.minute
        this.$time.second = this._prevValue.second
        this._prevValue = null
      }
      this._destroyClickOutside()
    })

    this.$popup.querySelector('bl-button').onclick = this._confirm.bind(this)
  }

  get hour() {
    return intRangeGetter('hour', 0, 23)(this)
  }

  set hour(value) {
    intRangeSetter('hour', 0, 23)(this, value)
  }

  get minute() {
    return intRangeGetter('minute', 0, 59)(this)
  }

  set minute(value) {
    intRangeSetter('minute', 0, 59)(this, value)
  }

  get second() {
    return intRangeGetter('second', 0, 59)(this)
  }

  set second(value) {
    intRangeSetter('second', 0, 59)(this, value)
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
    if (BlocksInput.observedAttributes.includes(name)) {
      this.$input.setAttribute(name, newValue)
    }
    if (BlocksTime.observedAttributes.includes(name)) {
      this.$time.setAttribute(name, newValue)
    }
    this.render()
  }

  render() {
    if ([this.$time.hour, this.$time.minute, this.$time.second].some(v => Object.is(v, NaN) || v == null)) {
      this.$input.value = ''
      return
    }
    this.$input.value = `${padLeft('0', 2, this.$time.hour)}:${padLeft('0', 2, this.$time.minute)}:${padLeft('0', 2, this.$time.second)}`
  }

  _confirm() {
    this._prevValue = null
    dispatchEvent(this, 'change', {
      detail: {
        hour: this.$time.hour,
        minute: this.$time.minute,
        second: this.$time.second
      }
    })
    this.$popup.open = false
  }

  _initClickOutside() {
    if (!this._clearClickOutside) {
      this._clearClickOutside = onClickOutside([this, this.$popup], () => {
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
