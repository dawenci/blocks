import '../popup/index.js'
import BlocksInput from '../input/index.js'
import BlocksDate from '../date/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { __height_base } from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import { boolSetter, enumGetter, intGetter, intSetter } from '../../common/property.js'

let idSeed = Date.now()

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

const TEMPLATE_HTML_INPUT = `<bl-input suffix-icon="date" id="result" readonly />`

const TEMPLATE_HTML_POPUP = `
<bl-popup append-to-body class="date-picker-popup" origin="top-start" arrow autoflip>
  <bl-date class="date-picker-panel"></bl-date>
  <div id="action" style="display:none;padding:5px;text-align:center;">
    <bl-button block type="primary" size="small">确定</bl-button>
  </div>
</bl-popup>
`

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

class BlocksDatePicker extends HTMLElement {
  static get observedAttributes() {
    return BlocksDate.observedAttributes.concat(BlocksInput.observedAttributes)
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
    this.$popup.anchor = () => this.$input

    this.$input.onfocus = this.$input.onclick = (e) => {
      this.$popup.open = true
    }

    this.$date.addEventListener('change', (e) => {
      if (this.$date.mode === null) {
        this._prevValue = null
        this.render()
        dispatchEvent(this, 'change', { detail: { value: this.value } })
        this.$popup.open = false
      }
      else if (this.$date.mode === 'range') {
        if (this.$date.value.length === 2) {
          this._prevValue = null
          this.render()
          dispatchEvent(this, 'change', { detail: { value: this.value } })
          this.$popup.open = false
        }
      }
      else {
        this.render()
      }
    })

    this.$popup.querySelector('bl-button').onclick = this._confirm.bind(this)

    this.$popup.addEventListener('open', () => {
      boolSetter('popup-open')(this, true)

      if (this.$date.mode !== null) {
        this._prevValue = this.$date.value
      }

      this.$popup.querySelector('#action').style.display = this.$date.mode === 'multiple' ? 'block' : 'none'
      this._initClickOutside()
      dispatchEvent(this, 'open')
    })

    this.$popup.addEventListener('close', () => {
      boolSetter('popup-open')(this, false)

      if (this.$date.mode !== null && this._prevValue) {
        this.$date.value = this._prevValue
        this._prevValue = null
      }

      this._destroyClickOutside()
      dispatchEvent(this, 'close')
    })

    this.$input.addEventListener('click-clear', () => {
      if (this.$date.mode == null) {
        this.$date.value = null
      }
      else {
        this.$date.value = []
      }

      this._prevValue = this.$date.value
      this.render()
    })
  }

  _confirm() {
    this._prevValue = null
    this.value = this.$date.value.slice()
    dispatchEvent(this, 'input', { detail: { value: this.value } })
    this.render()
    this.$popup.open = false
  }

  render() {
    if (this.$date.mode === 'range') {
      this.$input.value = (this.value ?? [])
        .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
        .join(' ~ ')
    }
    else if (this.$date.mode === 'multiple') {
      this.$input.value = (this.value ?? [])
        .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
        .join(', ')
    }
    else {
      this.$input.value = this.value
        ? `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()}`
        : ''
    }
  }

  get value() {
    return this.$date.value
  }

  set value(value) {
    this.$date.value = value
  }

  get disableMethod() {
    return this.$date.disableMethod
  }

  set disableMethod(value) {
    this.$date.disableMethod = value
  }

  getDateProp(prop) {
    return this.$date[prop]
  }

  setDateProp(prop, value) {
    this.$date[prop] = value
  }

  getInputProp(prop) {
    return this.$input[prop]
  }

  setInputProp(prop, value) {
    this.$input[prop] = value
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach((attr) => {
      upgradeProperty(this, attr)
    })
    document.body.appendChild(this.$popup)

    this.render()
    this.$popup.querySelector('#action').style.display = this.$date.mode === 'multiple' ? 'block' : 'none'
  }

  disconnectedCallback() {
    document.body.removeChild(this.$popup)
    this._destroyClickOutside()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (BlocksInput.observedAttributes.includes(name)) {
      this.$input.setAttribute(name, newValue)
    }
    if (BlocksDate.observedAttributes.includes(name)) {
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
}

if (!customElements.get('bl-date-picker')) {
  customElements.define('bl-date-picker', BlocksDatePicker)
}
