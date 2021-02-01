import { } from '../theme/var.js'
import '../popup/index.js'
import '../input/index.js'
import '../date-panel/index.js'
import { upgradeProperty } from '../core/upgradeProperty.js'

let idSeed = Date.now()

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  width: 220px;
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

const TEMPLATE_HTML = `
<blocks-input suffix-icon="date" id="result" readonly />
<blocks-popup append-to-body class="date-picker-popup" origin="top-start" arrow>
  <blocks-date-panel class="date-picker-panel" />
</blocks-popup>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksDatePicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'depth',
      'mindepth',
      'startdepth',
      'disableMethod',
      'multiple',
      'max',
      'loading',
      'clearable',
      'startWeekOn',
    ]
  }

  constructor() {
    super()
    this.id = `date-picker-${idSeed++}`

    this.attachShadow({ mode: 'open' })

    const fragment = template.content.cloneNode(true)
    this.$input = fragment.querySelector('#result')
    this.$popup = fragment.querySelector('blocks-popup')
    this.$panel = fragment.querySelector('blocks-date-panel')
    this.shadowRoot.appendChild(fragment)
    
    this.$popup.setAttribute('anchor', `#${this.id}`)

    this.$input.onfocus = this.$input.onclick = (e) => {
      this.$popup.open = true
    }

    this.$panel.addEventListener('input', e => {
      if (!this.$panel.multiple) this.$popup.open = false
      this.render()
    })
  }

  render() {
    if (this.multiple) {
      this.$input.value = (this.value ?? []).map(date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`).join(', ')
    }
    else {
      this.$input.value = this.value ? `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()}` : ''
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
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()

    if (!this._onClickOutside) {
      this._onClickOutside = (e) => {
        if (this.$popup.open && !this.contains(e.target) && !this.$panel.contains(e.target)) {
          this.$popup.open = false
        }
      }
    }

    document.addEventListener('click', this._onClickOutside)
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onClickOutside)
  }

  // adoptedCallback() {
  // }

  attributeChangedCallback(name, oldValue, newValue) {
    if (['clearable'].includes(name)) {
      this.$input.setAttribute(name, newValue)
    }
    if (['depth', 'mindepth', 'startdepth', 'multiple', 'max', 'loading', 'startWeekOn'].includes(name)) {
      this.$panel.setAttribute(name, newValue)
    }
    this.render()
  }

  _focus() {
    if (this.restorefocus && !this._prevFocus) {
      this._prevFocus = document.activeElement
    }
    this.$popup.focus()
  }

  _blur() {
    this.$popup.blur()
    if (this._prevFocus) {
      if (this.restorefocus && typeof this._prevFocus.focus) {
        this._prevFocus.focus()
      }
      this._prevFocus = undefined
    }
  }
}

if (!customElements.get('blocks-date-picker')) {
  customElements.define('blocks-date-picker', BlocksDatePicker)
}
