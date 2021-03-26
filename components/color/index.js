import { dispatchEvent } from '../../common/event.js'
import { enumGetter, enumSetter } from '../../common/property.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { padLeft, round } from '../../common/utils.js'
import { hsl2hsv, hsv2hsl, hsv2rgb, rgb2hsv, hex2rgba, parse, rgba2hex } from '../../common/color.js'
import {
  __radius_base,
  __color_primary,
  __color_warning,
  __transition_duration,
  __height_base,
  __height_small,
  __height_large,
  __border_color_base,
  __border_color_light,
  __fg_placeholder,
  __fg_secondary,
} from '../../theme/var.js'


const TEMPLATE_CSS = `<style>
:host {
  display: block;
  box-sizing: border-box;
  user-select: none;
  cursor: default;
  background-color: #fff;
  width: 100%;
  height: 234px;
  min-width: 180px;
  min-height: 180px;
}
:host(:focus) {
  outline: 0 none;
}
#layout {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
}
#hsv-picker {
  flex: 1 1 100%;
  position: relative;
  box-sizing: border-box;
  position: relative;
  width: 100%;
}

#hsv-picker .hue,
#hsv-picker .saturation,
#hsv-picker .value {
  position: absolute;
  top: 6px;
  right: 6px;
  bottom: 6px;
  left: 6px;
}
#hsv-picker .hue {
  background: hsl(0, 100%, 50%);
}
#hsv-picker .saturation {
  background: linear-gradient(to right, #fff, transparent);
}
#hsv-picker .value {
  background: linear-gradient(to top, #000, transparent);
}

#controls {
  flex: 0 0 auto;
  display: flex;
  flex-flow: row nowrap;
}

#result:before,
#alpha-bar:before {
  content: '';
  display: block;
  position: absolute;
  z-index: 0;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==) repeat;
}
#result {
  position: relative;
  flex: 0 0 50px;
  padding: 6px;
}
#result .bg {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  background: hsl(0, 100%, 50%);
}
#result:before {
  top: 6px;
  right: 6px;
  bottom: 6px;
  left: 6px;
}
#bars {
  flex: 1 1 auto;
}
#bars > div {
  margin: 6px 0;
}
#hue-bar,
#alpha-bar {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 12px;
}
#alpha-bar:before {
  top: 0;
  right: 6px;
  bottom: 0;
  left: 6px;
  border-radius: 6px;
}
#hue-bar .bg,
#alpha-bar .bg {
  position: absolute;
  top: 0;
  right: 6px;
  bottom: 0;
  left: 6px;
  border-radius: 6px;
}

#hue-bar .bg {
  /* 色环每 60 度一个主色，分别为 红、黄、绿、青、蓝、洋红 */
  background: linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%));
}
#alpha-bar .bg {
  background: linear-gradient(to right, transparent, hsl(0,100%,50%));
}

#hsv-picker button,
#hue-bar button,
#alpha-bar button {
  position: absolute;
  width: 12px;
  height: 12px;
  margin: 0;
  padding: 0;
  border: 0;
  background: #fff;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,.2);
}
#hsv-picker button:focus,
#hue-bar button:focus,
#alpha-bar button:focus {
  z-index: 2;
  border: 1px solid rgba(0,0,0,.2);
  outline: 0 none;
  box-shadow: 0 0 2px 2px rgba(0,0,0,.1);
}

#hue-bar button,
#alpha-bar button {
  left: 0;
  top: 0;
}

#models {
  flex: 0 0 auto;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  padding: 6px 32px 6px 6px;
  text-align: center;
}
#mode-content {
  width: 100%;
  display: flex;
  flex-flow: row;
  overflow: hidden;
}
#mode-content > div {
  box-sizing: border-box;
  width: 100%;
}
#mode-content > div:not(:first-child) {
  margin-left: 5px;
}
#mode-content input {
  box-sizing: border-box;
  width: 100%;
  height: 24px;
  line-height: 24px;
  vertical-align: top;
  text-align: center;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  font-size: 12px;
}
#mode-content input:focus {
  outline: none;
}
#mode-content span {
  display: block;
  font-size: 10px;
  color: var(--fg-secondary, ${__fg_secondary});
}
#mode-switch {
  position: absolute;
  top: 6px;
  right: 6px;
  bottom: 6px;
  left: auto;
  width: 20px;
  height: 24px;
  margin: 0;
  padding: 0;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  background: none;
  line-height: 24px;
  text-align: center;
  border-radius: var(--radius-base, ${__radius_base});
}
#mode-switch:focus {
  outline: none;
}
#mode-switch:hover {
  background: rgba(0,0,0,.05);
}
#mode-switch::before,
#mode-switch::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  width: 0;
  height: 0;
  margin: auto;
  border: 4px solid transparent;
}
#mode-switch::before {
  top: 0px;
  border-bottom-color: var(--border-color-base, ${__border_color_base});
}
#mode-switch::after {
  bottom: 0;
  border-top-color: var(--border-color-base, ${__border_color_base});
}

</style>`

// 内部使用 hsv 表示
// hue（色相分量）: 0 - 360 度的色环
// saturation（饱和度分量）：左右方向是 Saturation（饱和度） 取值 0 - 100。往左侧，白色越强，更稀释饱和度；往右侧，白色越少，越接近光谱颜色，饱和度越高。
// value（明度分量）：垂直方向是 Value（明度） 数值从 100 到 0 下降代表亮度下降的程度，为 0 时，最暗，为纯黑色。
// 增加黑色可以减小 value 而 saturation 不变，同样增加白色可以减小 saturation 而 value 不变。
// alpha（不透明度）： 0 - 1
const TEMPLATE_HTML = `
<div id="layout">
  <!-- 颜色选择区域 -->
  <div id="hsv-picker">
    <div class="hue"></div>
    <div class="saturation"></div>
    <div class="value"></div>
    <button></button>
  </div>

  <!-- 控制条 -->
  <div id="controls">
    <div id="result">
      <div class="bg"></div>
    </div>
    <div id="bars">
      <div id="hue-bar">
        <div class="bg"></div>
        <button></button>
      </div>
      <div id="alpha-bar">
        <div class="bg"></div>
        <button></button>
      </div>    
    </div>
  </div>

  <!-- 输入输出区 -->
  <div id="models">
    <div id="mode-content">
      <div><input data-index="0" /><span></span></div>
      <div><input data-index="1" /><span></span></div>
      <div><input data-index="2" /><span></span></div>
      <div><input data-index="3" /><span></span></div>
    </div>
    <button id="mode-switch"></button>
  </div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksColor extends HTMLElement {
  static get observedAttributes() {
    return ['mode', 'color']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$hsv = shadowRoot.getElementById('hsv-picker')
    this.$result = shadowRoot.getElementById('result')
    this.$hueBar = shadowRoot.getElementById('hue-bar')
    this.$alphaBar = shadowRoot.getElementById('alpha-bar')
    this.$hsvHue = this.$hsv.querySelector('.hue')
    this.$hsvButton = this.$hsv.querySelector('button')
    this.$hueButton = this.$hueBar.querySelector('button')
    this.$alphaButton = this.$alphaBar.querySelector('button')
    this.$alphaBarBg = this.$alphaBar.querySelector('.bg')
    this.$resultBg = this.$result.querySelector('.bg')
    this.$modeContent = shadowRoot.getElementById('mode-content')
    this.$modeSwitch = shadowRoot.getElementById('mode-switch')

    // 色相
    this._hue = 0
    // 饱和度
    this._saturation = 1
    // 明度
    this._value = 1
    // 不透明度
    this._alpha = 1

    // 取色事件
    this._initPickEvents()

    // 切换模式
    this.$modeSwitch.onclick = () => {
      const modes = ['hex', 'rgb', 'hsl', 'hsv']
      this.mode = modes[(modes.indexOf(this.mode) + 1) % 4]
    }

    // 处理输入
    this.$modeContent.onchange = e => {
      const $input = e.target
      const value = $input.value || ''
      const mode = this.mode
      if (mode === 'hex') {
        const rgba = parse(value)
        if (rgba) {
          this._preventUpdateModel = true
          this.rgba = rgba
          this._preventUpdateModel = false
        }
      }

      else if (mode === 'rgb') {
        const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input => Number($input.value))
        if (values.every(n => n >= 0 && n <= 255)) {
          this._preventUpdateModel = true
          this.rgba = values
          this._preventUpdateModel = false
        }
      }

      else if (mode === 'hsv') {
        const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input => parseFloat($input.value))
        if (values[0] < 0 || values[0] > 360) return
        if (values[1] < 0 || values[1] > 100) return
        if (values[2] < 0 || values[2] > 100) return
        this._preventUpdateModel = true
        this.hsv = [values[0], values[1] / 100, values[2] / 100]
        this._preventUpdateModel = false
      }

      else if (mode === 'hsl') {
        const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input => parseFloat($input.value))
        if (values[0] < 0 || values[0] > 360) return
        if (values[1] < 0 || values[1] > 100) return
        if (values[2] < 0 || values[2] > 100) return
        if (values[3] < 0 || values[3] > 1) return
        this._preventUpdateModel = true
        this.hsla = [values[0], values[1] / 100, values[2] / 100, values[3]]
        this._preventUpdateModel = false
      }
    }
  }

  get color() {
    return this.getAttribute('color')
  }

  set color(value) {
    this.setAttribute('color', value)
  }

  get mode() {
    return enumGetter('mode', ['hex', 'rgb', 'hsl', 'hsv'])(this)
  }

  set mode(value) {
    enumSetter('mode', [null, 'hex', 'rgb', 'hsl', 'hsv'])(this, value)
  }

  get hex() {
    return rgba2hex(this.rgba)
  }

  set hex(value) {
    const [r, g, b, a] = hex2rgba(value)
    const alpha = value.length > 7 ? a / 255 : this._alpha
    const [h, s, v] = rgb2hsv(r, g, b)
    if (this._setStates(h, s, v, alpha)) {
      this.render()
    }
  }

  get hsl() {
    return hsv2hsl(...this.hsv)
  }

  set hsl([hl, sl, l]) {
    const [hv, sv, v] = hsl2hsv(hl, sl, l)
    if (this._setStates(hv, sv, v, this._alpha)) {
      this.render()
    }
  }

  get hsla() {
    return this.hsl.concat(this._alpha)
  }

  set hsla([hl, sl, l, a]) {
    const [hv, sv, v] = hsl2hsv(hl, sl, l)
    if (this._setStates(hv, sv, v, a)) {
      this.render()
    }
  }

  get hsv() {
    return [this._hue, this._saturation, this._value]
  }

  set hsv([h, s, v]) {
    if (this._setStates(h, s, v, this._alpha)) {
      this.render()
    }
  }
  
  get rgb() {
    return hsv2rgb(...this.hsv).map(n => Math.round(n))
  }

  set rgb([r, g, b]) {
    const [h, s, v] = rgb2hsv(r, g, b)
    if (this._setStates(h, s, v, this._alpha)) {
      this.render()
    }
  }

  get rgba() {
    return this.rgb.concat(this._alpha)
  }

  set rgba([r, g, b, a]) {
    const [h, s, v] = rgb2hsv(r, g, b)
    if (this._setStates(h, s, v, a)) {
      this.render()
    }
    else {
      console.log('no update', h, s, v)
    }
  }

  render() {
    this._updateControls()
    this._updateBg()
    this._updateModels()
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this._clearSizeObserve = sizeObserve(this.$layout, this.render.bind(this))
  }

  disconnectedCallback() {
    this._clearSizeObserve()
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'mode') {
      this.render()
    }
    if (attrName === 'color') {
      const oldRgba = this.rgba
      const newRgba = parse(newVal)
      const oldHexStr = (oldRgba && rgba2hex(oldRgba)) ?? ''
      const newHexStr = (newRgba && rgba2hex(newRgba)) ?? ''
      if (newRgba && oldHexStr !== newHexStr) {
        this.rgba = newRgba
      }
    }
  }

  _initPickEvents() {
    this._dragging = false
    let $button = null
    let wrapWidth = null
    let wrapHeight = null
    let moveStart = null
    let positionStart = null
    const onmove = (e) => {
      const moveOffset = {
        x: e.pageX - moveStart.x,
        y: e.pageY - moveStart.y
      }
      let x = positionStart.x + moveOffset.x
      let y = positionStart.y + moveOffset.y
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > (wrapWidth - 12)) x = wrapWidth - 12
      if (y > (wrapHeight - 12)) y = wrapHeight - 12

      $button.style.left = x + 'px'
      $button.style.top = y + 'px'

      if (this._updateState()) {
        this._updateBg()
        this._updateModels()
      }
    }

    const onup = (e) => {
      if (this._updateState()) {
        this._updateBg()
        this._updateModels()
      }
      window.removeEventListener('mousemove', onmove)
      window.removeEventListener('mouseup', onup)
      positionStart = null
      moveStart = null
      wrapWidth = null
      wrapHeight = null
      this._dragging = false
    }

    const ondown = (e) => {
      this._dragging = true

      const $wrap = [this.$hueBar, this.$alphaBar, this.$hsv].find($wrap => $wrap.contains(e.target))
      $button = $wrap.querySelector('button')

      const rect = $wrap.getBoundingClientRect()
      wrapWidth = rect.width
      wrapHeight = rect.height
      moveStart = { x: e.pageX, y: e.pageY }

      let x = e.clientX - rect.x - 6
      let y = e.clientY - rect.y - 6
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > (wrapWidth - 12)) x = wrapWidth - 12
      if (y > (wrapHeight - 12)) y = wrapHeight - 12

      positionStart = { x, y }
      window.addEventListener('mousemove', onmove)
      window.addEventListener('mouseup', onup)

      $button.style.left = x + 'px'
      $button.style.top = y + 'px'
      if (this._updateState()) {
        this._updateBg()
        this._updateModels()
      }
    }

    this.$hueBar.onmousedown = ondown
    this.$alphaBar.onmousedown = ondown
    this.$hsv.onmousedown = ondown
  }

  _updateControls() {
    // 透明度
    const alphaBarWidth = this.$alphaBar.clientWidth - 12
    const alphaX = this._alpha * alphaBarWidth
    this.$alphaButton.style.left = alphaX + 'px'
    // 色相
    const hueBarWidth = this.$hueBar.clientWidth - 12
    const hueX = this._hue / 360 * hueBarWidth
    this.$hueButton.style.left = hueX + 'px'
    // HSV
    const width = this.$hsv.clientWidth - 12
    const height = this.$hsv.clientHeight - 12
    const x = this._saturation * width
    const y = height - this._value * height
    this.$hsvButton.style.top = y + 'px'
    this.$hsvButton.style.left = x + 'px'
  }

  _setStates(hue, saturation, value, alpha) {
    let changed = this._hue !== hue || this._saturation !== saturation || this._value !== value || this._alpha !== alpha
    this._hue = hue
    this._saturation = saturation
    this._value = value
    this._alpha = alpha

    if (changed) {
      this.color = this.hex
      dispatchEvent(this, 'change')
    }
    return changed
  }

  _updateState() {
    // 透明度
    const alphaBarWidth = this.$alphaBar.clientWidth - 12
    const alphaX = parseInt(getComputedStyle(this.$alphaButton).left, 10) || 0
    const alpha = alphaX / alphaBarWidth
    // 色相
    const hueBarWidth = this.$hueBar.clientWidth - 12
    const hueX = parseInt(getComputedStyle(this.$hueButton).left, 10) || 0
    const hue = Math.floor(360 * (hueX / hueBarWidth))
    // HSV
    const width = this.$hsv.clientWidth - 12
    const height = this.$hsv.clientHeight - 12
    const x = parseInt(getComputedStyle(this.$hsvButton).left, 10) || 0
    const y = parseInt(getComputedStyle(this.$hsvButton).top, 10) || 0
    const saturation = Math.floor(100 * (x / width)) / 100
    const value = 1 - Math.floor(100 * (y / height)) / 100
    return this._setStates(hue, saturation, value, alpha)
  }

  _updateBg() {
    const bg = `hsl(${this._hue}, 100%, 50%)`
    this.$hsvHue.style.backgroundColor = bg
    this.$alphaBarBg.style.backgroundImage = `linear-gradient(to right, transparent, ${bg})`
    const resultBg = this.hsla
    this.$resultBg.style.backgroundColor = `hsla(${resultBg[0]},${resultBg[1] * 100}%,${resultBg[2] * 100}%,${resultBg[3]})`
  }

  _updateModels() {
    // 手输的时候，避免反复触发 update（rgb 和 hsv 相互转换无法一一对应，会出现输入的数字瞬间被覆盖回去的问题）。
    if (this._preventUpdateModel) return

    const mode = this.mode
    const children = Array.prototype.slice.call(this.$modeContent.children)
    const inputs = children.map($el => $el.querySelector('input'))
    const spans = children.map($el => $el.querySelector('span'))
    if (mode === 'hex') {
      children.forEach(($el, index) => $el.style.display = index === 0 ? '' : 'none')
      children[0].querySelector('input').value = this.hex
      spans[0].textContent = 'HEX'
    }
    else if (mode === 'rgb') {
      const rgba = this.rgba
      children.forEach(($el) => $el.style.display = '')
      inputs[0].value = rgba[0]
      inputs[1].value = rgba[1]
      inputs[2].value = rgba[2]
      inputs[3].value = round(rgba[3], 2)
      spans[0].textContent = 'R'
      spans[1].textContent = 'G'
      spans[2].textContent = 'B'
      spans[3].textContent = 'A'
    }
    else if (mode === 'hsv') {
      const hsv = this.hsv
      children.forEach(($el, index) => $el.style.display = index === 3 ? 'none' : '')
      inputs[0].value = Math.round(hsv[0] % 360)
      inputs[1].value = Math.round(hsv[1] * 100) + '%'
      inputs[2].value = Math.round(hsv[2] * 100) + '%'
      spans[0].textContent = 'H'
      spans[1].textContent = 'S'
      spans[2].textContent = 'V'
    }
    else if (mode === 'hsl') {
      const hsla = this.hsla
      children.forEach(($el) => $el.style.display = '')
      inputs[0].value = Math.round(hsla[0] % 360)
      inputs[1].value = Math.round(hsla[1] * 100) + '%'
      inputs[2].value = Math.round(hsla[2] * 100) + '%'
      inputs[3].value = round(hsla[3], 2)
      spans[0].textContent = 'H'
      spans[1].textContent = 'S'
      spans[2].textContent = 'L'
      spans[3].textContent = 'A'
    }
  }
}

if (!customElements.get('bl-color')) {
  customElements.define('bl-color', BlocksColor)
}
