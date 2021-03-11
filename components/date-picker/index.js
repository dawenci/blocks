import '../popup/index.js'
import '../input/index.js'
import '../date/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { __height_base } from '../theme/var.js'

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
</bl-popup>
`

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

class BlocksDatePicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'depth',
      'mindepth',
      'startdepth',
      'multiple',
      'max',
      'loading',
      'clearable',
      'start-week-on'
    ]
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
    this.$popup.setAttribute('anchor', `#${this.id}`)

    this.$input.onfocus = this.$input.onclick = (e) => {
      this.$popup.open = true
    }

    this.$panel.addEventListener('input', (e) => {
      if (!this.$panel.multiple) this.$popup.open = false
      this.render()
    })

    this.$popup.addEventListener('open', () => {
      this._initClickOutside()
    })
    this.$popup.addEventListener('close', () => {
      this._destroyClickOutside()
    })
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
  }

  get value() {
    return this.$panel.value
  }

  set value(value) {
    this.$panel.value = value
  }

  get clearable() {
    return this.$input.clearable
  }

  set clearable(value) {
    this.$input.clearable = value
  }

  get depth() {
    return this.$panel.depth
  }

  set depth(value) {
    this.$panel.depth = value
  }

  get mindepth() {
    return this.$panel.mindepth
  }

  set mindepth(value) {
    this.$panel.mindepth = value
  }

  get startdepth() {
    return this.$panel.startdepth
  }

  set startdepth(value) {
    this.$panel.startdepth = value
  }

  get max() {
    return this.$panel.max
  }

  set max(value) {
    this.$panel.max = value
  }

  get multiple() {
    return this.$panel.multiple
  }

  set multiple(value) {
    this.$panel.multiple = value
  }

  get disableMethod() {
    return this.$panel.disableMethod
  }

  set disableMethod(value) {
    this.$panel.disableMethod = value
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

if (!customElements.get('bl-date-picker')) {
  customElements.define('bl-date-picker', BlocksDatePicker)
}
