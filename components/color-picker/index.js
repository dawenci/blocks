import '../popup/index.js'
import '../input/index.js'
import '../color/index.js'
import '../icon/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { __height_base, __height_large, __height_small, __radius_base } from '../../theme/var.js'
import { dispatchEvent } from '../../common/event.js'
import { disabledGetter, disabledSetter } from '../../common/propertyAccessor.js'

let idSeed = Date.now()

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  width: var(--height-base, ${__height_base});
  height: var(--height-base, ${__height_base});
  user-select: none;
  cursor: default;
  position: relative;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==) repeat;
}
:host(:focus) {
  outline: 0 none;
}

:host([disabled]) #result,
:host([disabled]) bl-icon {
  cursor: not-allowed;
}

:host([size="small"]) {
  width: var(--height-small, ${__height_small});
  height: var(--height-small, ${__height_small});
}
:host([size="large"]) {
  width: var(--height-large, ${__height_large});
  height: var(--height-large, ${__height_large});
}

#result {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-base, ${__radius_base});
}
bl-icon {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 16px;
  height: 16px;
  padding: 2px;
  margin: auto;
  border-radius: var(--radius-base, ${__radius_base});
  background: rgba(0,0,0,.1);
  fill: #fff;
}
:host(:hover) bl-icon {
  background: none;
}
</style>`

const TEMPLATE_HTML_INPUT = `<div id="result"><bl-icon value="down"></bl-icon></div>`

const TEMPLATE_HTML_POPUP = `
<bl-popup append-to-body class="color-picker-popup" origin="top-start" arrow autoflip>
  <bl-color class="color-picker-panel"></bl-color>
  <div id="action" style="padding:5px;text-align:center;display:flex;">
    <bl-button type="primary" size="small" style="flex:1 1 auto;">确定</bl-button>
  </div>
</bl-popup>
`

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

class BlocksColorPicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'disabled',
      'size',
    ]
  }

  constructor() {
    super()
    this.id = `color-picker-${idSeed++}`

    this.attachShadow({ mode: 'open' })

    // input 部分
    const fragment = inputTemplate.content.cloneNode(true)
    this.$result = fragment.querySelector('#result')
    this.shadowRoot.appendChild(fragment)

    // 面板部分
    this.$popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup')
    this.$panel = this.$popup.querySelector('bl-color')
    this.$popup.setAttribute('anchor', `#${this.id}`)

    this.$result.onfocus = this.$result.onclick = (e) => {
      if (this.disabled) return
      this.$popup.open = true
      this.$panel.render()
    }

    this.$panel.addEventListener('change', (e) => {
      this.render()
      dispatchEvent(this, 'change')
    })

    this.$popup.addEventListener('open', () => {
      this._initClickOutside()
    })

    this.$popup.addEventListener('close', () => {
      this._destroyClickOutside()
    })
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get hex() {
    return this.$panel.hex
  }

  set hex(value) {
    this.$panel.hex = value
  }

  get hsl() {
    return this.$panel.hsl
  }

  set hsl(value) {
    this.$panel.hsl = value
  }

  get hsla() {
    return this.$panel.hsla
  }

  set hsla(value) {
    this.$panel.hsla = value
  }

  get hsv() {
    return this.$panel.hsv
  }

  set hsv(value) {
    this.$panel.hsv = value
  }

  get rgb() {
    return this.$panel.rgb
  }

  set rgb(value) {
    this.$panel.rgb = value
  }

  get rgba() {
    return this.$panel.rgba
  }

  set rgba(value) {
    this.$panel.rgba = value
  }
  
  render() {  
    const resultBg = this.$panel.hsla
    if (resultBg) {
      this.$result.style.backgroundColor = `hsla(${resultBg[0]},${resultBg[1] * 100}%,${resultBg[2] * 100}%,${resultBg[3]})`
    }
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
      this.$result.setAttribute(name, newValue)
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

if (!customElements.get('bl-color-picker')) {
  customElements.define('bl-color-picker', BlocksColorPicker)
}
