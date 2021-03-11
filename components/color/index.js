import { dispatchEvent } from '../../common/event.js'
import { intRangeGetter, intRangeSetter, numGetter, numRangeGetter, numRangeSetter, numSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { padLeft, rgbFromHexColor } from '../../common/utils.js'
import {
  __radius_base,
  __color_primary,
  __color_warning,
  __transition_duration,
  __height_base,
  __height_small,
  __height_large,
  __border_color_base,
} from '../theme/var.js'


const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  user-select: none;
  cursor: default;
  background-color: #fff;
  width: 234px;
  height: 234px;
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
#hsv {
  flex: 1 1 100%;
  position: relative;
  box-sizing: border-box;
  position: relative;
  width: 100%;
}

#hsv .hue,
#hsv .saturation,
#hsv .value {
  position: absolute;
  top: 6px;
  right: 6px;
  bottom: 6px;
  left: 6px;
}
#hsv .hue {
  background: hsl(0, 100%, 50%);
}
#hsv .saturation {
  background: linear-gradient(to right, #fff, transparent);
}
#hsv .value {
  background: linear-gradient(to top, #000, transparent);
}

#body {
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
#controls {
  flex: 1 1 auto;
}
#controls > div {
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

#hsv button,
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
#hsv button:focus,
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

</style>`

// 内部使用 hsv 表示
// hue（色相分量）: 0 - 360 度的色环
// saturation（饱和度分量）：左右方向是 Saturation（饱和度） 取值 0 - 100。往左侧，白色越强，更稀释饱和度；往右侧，白色越少，越接近光谱颜色，饱和度越高。
// value（明度分量）：垂直方向是 Value（明度） 数值从 100 到 0 下降代表亮度下降的程度，为 0 时，最暗，为纯黑色。
// 增加黑色可以减小 value 而 saturation 不变，同样增加白色可以减小 saturation 而 value 不变。
// alpha（不透明度）： 0 - 1
const TEMPLATE_HTML = `
<div id="layout">
  <div id="hsv">
    <div class="hue"></div>
    <div class="saturation"></div>
    <div class="value"></div>
    <button></button>
  </div>
  <div id="body">
    <div id="result">
      <div class="bg"></div>
    </div>
    <div id="controls">
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
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksColor extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$hsv = shadowRoot.getElementById('hsv')
    this.$result = shadowRoot.getElementById('result')
    this.$hueBar = shadowRoot.getElementById('hue-bar')
    this.$alphaBar = shadowRoot.getElementById('alpha-bar')
    this.$hsvHue = this.$hsv.querySelector('.hue')
    this.$hsvButton = this.$hsv.querySelector('button')
    this.$hueButton = this.$hueBar.querySelector('button')
    this.$alphaButton = this.$alphaBar.querySelector('button')
    this.$alphaBarBg = this.$alphaBar.querySelector('.bg')
    this.$resultBg = this.$result.querySelector('.bg')

    // 色相
    this._hue = 0
    // 饱和度
    this._saturation = 1
    // 明度
    this._value = 1
    // 不透明度
    this._alpha = 1

    // 取色事件
    this._initEvents()
  }

  get hex() {
    const [r, g, b] = this.rgb
    return `#${padLeft('0', 2, r.toString(16))}${padLeft('0', 2, g.toString(16))}${padLeft('0', 2, b.toString(16))}`
  }

  set hex(value) {
    const [r, g, b] = rgbFromHexColor(value)
    const [h, s, v] = rgb2hsv(r, g, b)
    this._hue = h
    this._saturation = s
    this._value = v
    this._updateControls()
    this._updateBg()
  }

  get hsv() {
    return [this._hue, this._saturation, this._value]
  }

  set hsv([h, s, v]) {
    this._hue = h
    this._saturation = s
    this._value = v
    this._updateControls()
    this._updateBg()
  }

  get hsl() {
    return hsv2hsl(...this.hsv)
  }

  set hsl([hl, sl, l]) {
    const [hv, sv, v] = hsl2hsv(hl, sl, l)
    this._hue = hv
    this._saturation = sv
    this._value = v
    this._updateControls()
    this._updateBg()
  }

  get hsla() {
    return this.hsl.concat(this._alpha)
  }

  set hsla([hl, sl, l, a]) {
    const [hv, sv, v] = hsl2hsv(hl, sl, l)
    this._hue = hv
    this._saturation = sv
    this._value = v
    this._alpha = a
    this._updateControls()
    this._updateBg()
  }

  get rgb() {
    return hsv2rgb(...this.hsv)
  }

  set rgb([r, g, b]) {
    const [h, s, v] = rgb2hsv(r, g, b)
    this._hue = h
    this._saturation = s
    this._value = v
    this._updateControls()
    this._updateBg()
  }

  get rgba() {
    return this.rgb.concat(this._alpha)
  }

  set rgba([r, g, b, a]) {
    const [h, s, v] = rgb2hsv(r, g, b)
    this._hue = h
    this._saturation = s
    this._value = v
    this._alpha = a
    this._updateControls()
    this._updateBg()
  }

  render() {}

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
    this._updateControls()
    this._updateState()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}

  _initEvents() {
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
      this._updateState()
      this._updateBg()
    }

    const onup = (e) => {
      this._updateState()
      this._updateBg()
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
      this._updateState()
      this._updateBg()
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

  _updateState() {
    // 透明度
    const alphaBarWidth = this.$alphaBar.clientWidth - 12
    const alphaX = parseInt(getComputedStyle(this.$alphaButton).left, 10) || 0
    this._alpha = alphaX / alphaBarWidth
    // 色相
    const hueBarWidth = this.$hueBar.clientWidth - 12
    const hueX = parseInt(getComputedStyle(this.$hueButton).left, 10) || 0
    this._hue = Math.floor(360 * (hueX / hueBarWidth))
    // HSV
    const width = this.$hsv.clientWidth - 12
    const height = this.$hsv.clientHeight - 12
    const x = parseInt(getComputedStyle(this.$hsvButton).left, 10) || 0
    const y = parseInt(getComputedStyle(this.$hsvButton).top, 10) || 0
    this._saturation = Math.floor(100 * (x / width)) / 100
    this._value = 1 - Math.floor(100 * (y / height)) / 100
  }

  _updateBg() {
    const bg = `hsl(${this._hue}, 100%, 50%)`
    this.$hsvHue.style.backgroundColor = bg
    this.$alphaBarBg.style.backgroundImage = `linear-gradient(to right, transparent, ${bg})`
    const resultBg = this.hsla
    this.$resultBg.style.backgroundColor = `hsla(${resultBg[0]},${resultBg[1] * 100}%,${resultBg[2] * 100}%,${resultBg[3]})`
    dispatchEvent(this, 'change')
  }
}

if (!customElements.get('bl-color')) {
  customElements.define('bl-color', BlocksColor)
}

/**
 * 
 * HSV 转 RGB
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * 
 * @param {number} h 0 - 360
 * @param {number} s 0 - 1
 * @param {number} v 0 - 1
 */
function hsv2rgb(hue, saturation, value) {
  const chroma = value * saturation
  // 色环中按 60 度分段，当前落在哪一段
  const H = hue / 60
  const X = chroma * (1 - Math.abs(H % 2 - 1))

  if (hue < 0 || hue > 360) return [0,0,0]
  // 计算出的 r，g，b 取值为 0 - 1，转换成 0 - 255 输出
  let [r, g, b] =
    (H >= 0 && H <= 1) ? [chroma, X, 0]
  : (H > 1 && H <= 2) ? [X, chroma, 0]
  : (H > 2 && H <= 3) ? [0, chroma, X]
  : (H > 3 && H <= 4) ? [0, X, chroma]
  : (H > 4 && H <= 5) ? [X, 0, chroma]
  : (H > 5 && H <= 6) ? [chroma, 0, X]
  : [0, 0, 0]

  const m = value - chroma
  return [Math.floor((r + m) * 255), Math.floor((g + m) * 255), Math.floor((b + m) * 255)]
}

// https://www.rapidtables.com/convert/color/rgb-to-hsv.html
function rgb2hsv(r, g, b) {
  // 0 - 255，转换成 0 - 1
  r = r / 255
  g = g / 255
  b = b / 255

  const cMax = Math.max(r, g, b)
  const cMin = Math.min(r, g, b)
  const delta = cMax - cMin

  let h
  if (delta === 0) {
    h = 0
  }
  else if (cMax === r) {
    h = 60 * (((g - b) / delta) % 6)
  }
  else if (cMax === g) {
    h = 60 * ((b - r) / delta + 2)
  }
  else if (cMax === b) {
    h = 60 * ((r - g) / delta + 4) 
  }
  h = Math.floor(h)

  let s
  if (cMax === 0) {
    s = 0
  }
  else {
    s = delta / cMax
  }
  let v = cMax

  return [h, s, v]
}

/**
 * 
 * HSV 转 HSL
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * 
 * @param {number} Hv 0 - 360
 * @param {number} Sv 0 - 1
 * @param {number} V 0 - 1
 */
function hsv2hsl(Hv, Sv, V) {
  const Hl = Hv
  const L = V * (1 - (Sv / 2))
  const Sl = (L === 0 || L === 1) ? 0 : ((V - L) / Math.min(L, 1 - L))
  return [Hl, Sl, L]
}

/**
 * 
 * HSL 转 HSV
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * 
 * @param {number} Hl 0 - 360
 * @param {number} Sl 0 - 1
 * @param {number} L 0 - 1
 */
function hsl2hsv(Hl, Sl, L) {
  const Hv = Hl
  const V = L + Sl * Math.min(L, 1 - L)
  const Sv = V === 0 ? 0 : 2 * (1 - (L / V))
  return [Hv, Sv, V]
}
