import BlocksPopup from '../popup/index.js'
import BlocksInput from '../input/index.js'
import BlocksDate from '../date/index.js'
import BlocksTime from '../time/index.js'

import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __height_base } from '../../theme/var.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { dispatchEvent } from '../../common/event.js'
import { padLeft } from '../../common/utils.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  width: calc(var(--height-base, ${__height_base}) * 7 + 10px);
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

const TEMPLATE_HTML_INPUT = `
<bl-input suffix-icon="date" id="result" readonly />
<bl-input suffix-icon="time" id="result" readonly />
`

const TEMPLATE_HTML_POPUP = `
<bl-popup append-to-body class="datetime-picker-popup" origin="top-start" arrow>
  <div id="panes" style="display:flex;flex-flow:row nowrap;">
    <div id="date-pane" style="flex:0 0 auto;">
      <bl-date class="date-picker-panel"></bl-date>
    </div>

    <div id="time-pane" style="flex:0 0 auto;display:flex;flex-flow:column nowrap;margin-left:15px;">
      <div id="time-value" style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;"></div>
      <bl-time class="time-picker-panel"></bl-time>
    </div>
  </div>
  <div id="action" style="padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

class BlocksDateTimePicker extends HTMLElement {
  static get observedAttributes() {
    return BlocksInput.observedAttributes
      .concat(BlocksDate.observedAttributes)
      .concat(BlocksTime.observedAttributes)
      .concat([])
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
    this.$date = this.$popup.querySelector('bl-date')
    this.$time = this.$popup.querySelector('bl-time')
    this.$timeValue = this.$popup.querySelector('#time-value')

    this.$popup.anchor = () => this.$input

    this.$input.onfocus = this.$input.onclick = (e) => {
      this.$popup.open = true
    }

    this.$date.addEventListener('input', (e) => {
      if (!this.$date.multiple) {
        this.$popup.open = false
      }
      dispatchEvent(this, 'input', { detail: { value: this.value } })
      this.render()
    })

    this.$popup.addEventListener('open', () => {
      this._updateLayout()
      this._initClickOutside()
      dispatchEvent(this, 'open')
    })

    this.$popup.addEventListener('close', () => {
      this._destroyClickOutside()
      dispatchEvent(this, 'close')
    })

    this.$time.addEventListener('change', () => {
      this.$timeValue.textContent = `${padLeft('0', 2, this.$time.hour)}:${padLeft('0', 2, this.$time.minute)}:${padLeft('0', 2, this.$time.second)}`
    })
  }

  get date() {
    return this.$date.value
  }

  set date(value) {
    this.$date.value = value
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
      this.$date.setAttribute(name, newValue)
    }
    this.render()
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

  render() {
    if (this.multiple) {
      this.$input.value = (this.value ?? [])
        .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
        .join(', ')
    } else {
      this.$input.value = this.value
        ? `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()}`
        : ''
    }

    if ([this.hour, this.minute, this.second].some(v => Object.is(v, NaN) || v == null)) {
      this.value = ''
      return
    }
    this.value = `${padLeft('0', 2, this.hour)}:${padLeft('0', 2, this.minute)}:${padLeft('0', 2, this.second)}`
  }

  _updateLayout() {
    this.$time.style.height = this.$date.$content.offsetHeight + 'px'
    this.$timeValue.style.height = this.$date.offsetHeight - this.$date.$content.offsetHeight + 'px'
  }  
}

if (!customElements.get('bl-datetime-picker')) {
  customElements.define('bl-datetime-picker', BlocksDateTimePicker)
}
