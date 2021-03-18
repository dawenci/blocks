import '../popup/index.js'
import BlocksInput from '../input/index.js'
import BlocksDate from '../date/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { __height_base } from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import { enumGetter, intGetter, intSetter } from '../../common/property.js'

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
<bl-popup append-to-body class="date-picker-popup" origin="top-start" arrow>
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
    this.id = `date-picker-${idSeed++}`

    this.attachShadow({ mode: 'open' })

    // input 部分
    const fragment = inputTemplate.content.cloneNode(true)
    this.$input = fragment.querySelector('#result')
    this.shadowRoot.appendChild(fragment)

    // 面板部分
    this.$popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup')
    this.$panel = this.$popup.querySelector('bl-date')
    this.$close = this.$popup.querySelector('bl-button')
    this.$popup.setAttribute('anchor', `#${this.id}`)

    this.$input.onfocus = this.$input.onclick = (e) => {
      this.$popup.open = true
    }

    this.$panel.addEventListener('input', (e) => {
      if (this.$panel.mode === null) {
        this.value = this.$panel.value
        dispatchEvent(this, 'input', { detail: { value: this.value } })
        this.render()
        this.$popup.open = false
      }
      if (this.$panel.mode === 'range') {
        if (this.$panel.value.length === 2) {
          this.value = this.$panel.value.slice()
          dispatchEvent(this, 'input', { detail: { value: this.value } })
          this.render()
          this.$popup.open = false
        }
      }
    })

    this.$close.onclick = e => {
      this.value = this.$panel.value.slice()
      dispatchEvent(this, 'input', { detail: { value: this.value } })
      this.render()
      this.$popup.open = false
    }

    this.$popup.addEventListener('open', () => {
      this.$popup.querySelector('#action').style.display = this.$panel.mode === 'multiple' ? 'block' : 'none'
      this._initClickOutside()
      dispatchEvent(this, 'open')
    })

    this.$popup.addEventListener('close', () => {
      this._destroyClickOutside()
      dispatchEvent(this, 'close')

      if (this.$panel.mode == null) {
        this.$panel.value = this.value
      }
      else {
        this.$panel.value = (this.value ?? []).slice()
      }
    })

    this.$input.addEventListener('click-clear', () => {
      if (this.$panel.mode == null) {
        this.value = null
        this.$panel.value = null
      }
      else {
        this.value = []
        this.$panel.value = []
      }
      this.render()
    })
  }

  render() {
    if (this.$panel.mode === 'range') {
      this.$input.value = (this.value ?? [])
        .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
        .join(' ~ ')
    }
    else if (this.$panel.mode === 'multiple') {
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
    return this._value
  }

  set value(value) {
    this._value = value
  }

  get disableMethod() {
    return this.$panel.disableMethod
  }

  set disableMethod(value) {
    this.$panel.disableMethod = value
  }

  getDateProp(prop) {
    return this.$panel[prop]
  }

  setDateProp(prop, value) {
    this.$panel[prop] = value
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
    this.$popup.querySelector('#action').style.display = this.$panel.mode === 'multiple' ? 'block' : 'none'
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
      this.$panel.setAttribute(name, newValue)
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
