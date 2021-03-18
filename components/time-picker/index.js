import '../popup/index.js'
import BlocksInput from '../input/index.js'
import BlocksTime from '../time/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { __height_base } from '../../theme/var.js'
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
    return BlocksTime.observedAttributes.concat(BlocksInput.observedAttributes)
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
      this.$panel.hour = this.$panel.minute = this.$panel.second = null
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

  get value() {
    return this.$input.value
  }

  set value(value) {
    this.$input.value = value
  }
  
  render() {
    if ([this.$panel.hour, this.$panel.minute, this.$panel.second].some(v => Object.is(v, NaN) || v == null)) {
      this.value = ''
      return
    }
    this.value = `${padLeft('0', 2, this.$panel.hour)}:${padLeft('0', 2, this.$panel.minute)}:${padLeft('0', 2, this.$panel.second)}`
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
