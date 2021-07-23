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
  fill: rgba(255,255,255,.8);
}
bl-icon.light {
  fill: rgba(0,0,0,.5);
}
</style>`

const TEMPLATE_HTML_INPUT = `<div id="result"><bl-icon value="down"></bl-icon></div>`

const TEMPLATE_HTML_POPUP = `
<bl-popup append-to-body class="color-picker-popup" origin="top-start" arrow autoflip>
  <bl-color class="color-picker-panel" style="width:234px;"></bl-color>
  <div id="action" style="padding:5px;text-align:center;display:flex;">
    <bl-button type="primary" size="small" style="flex:1 1 auto;">确定</bl-button>
  </div>
</bl-popup>
`

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

export class BlocksColorPicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
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
    this.$icon = this.$result.querySelector('bl-icon')
    this.shadowRoot.appendChild(fragment)

    // 面板部分
    this.$popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup')
    this.$color = this.$popup.querySelector('bl-color')
    this.$popup.anchor = () => this.$result

    this.$result.onfocus = this.$result.onclick = (e) => {
      if (this.disabled) return
      this.$popup.open = true
      this.$color.render()
    }

    this.$color.addEventListener('change', (e) => {
      this.value = this.$color.value
      this.render()
      dispatchEvent(this, 'change')
    })

    this.$popup.addEventListener('opened', () => {
      this._initClickOutside()
    })

    this.$popup.addEventListener('closed', () => {
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
    return this.$color.hex
  }

  set hex(value) {
    this.$color.hex = value
  }

  get hsl() {
    return this.$color.hsl
  }

  set hsl(value) {
    this.$color.hsl = value
  }

  get hsla() {
    return this.$color.hsla
  }

  set hsla(value) {
    this.$color.hsla = value
  }

  get hsv() {
    return this.$color.hsv
  }

  set hsv(value) {
    this.$color.hsv = value
  }

  get hsva() {
    return this.$color.hsva
  }

  set hsva(value) {
    this.$color.hsva = value
  }

  get rgb() {
    return this.$color.rgb
  }

  set rgb(value) {
    this.$color.rgb = value
  }

  get rgba() {
    return this.$color.rgba
  }

  set rgba(value) {
    this.$color.rgba = value
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(value) {
    this.setAttribute('value', value)
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

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (['clearable'].includes(attrName)) {
      this.$result.setAttribute(attrName, newValue)
    }

    if (attrName === 'value') {
      if (oldValue !== newValue) {
        this.$color.setAttribute('value', newValue)
      }
    }

    this.render()
  }

  render() {  
    const hsla = this.$color.hsla
    if (hsla) {
      this.$result.style.backgroundColor = `hsla(${hsla[0]},${hsla[1] * 100}%,${hsla[2] * 100}%,${hsla[3]})`
      // 下拉箭头，根据背景亮度设置深色或浅色
      let lightness = hsla[2] * 100
      // 黄色到青色区间亮度太高，优先使用暗色箭头
      if (hsla[0] > 50 && hsla[0] < 195) {
        lightness = lightness > 40 ? 0 : 100
      }
      else {
        lightness = lightness > 50 ? 10 : 90
      }
      this.$icon.fill = `hsla(${hsla[0]},${50}%,${lightness}%,1)`
    }
  }
  
  toHexString() {
    return this.$color.toHexString()
  }

  toRgbString() {
    return this.$color.toRgbString()
  }

  toRgbaString() {
    return this.$color.toRgbaString()
  }

  toHslString() {
    return this.$color.toHslString()
  }
  
  toHslaString() {
    return this.$color.toHslaString()
  }
  
  toHsvString() {
    return this.$color.toHsvString()
  }

  toHsvaString() {
    return this.$color.toHsvaString()
  }

  _initClickOutside() {
    if (!this._clearClickOutside) {
      this._clearClickOutside = onClickOutside([this, this.$color], () => {
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
