import { dispatchEvent } from '../../common/event.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { round } from '../../common/utils.js'
import { onDragMove } from '../../common/onDragMove.js'
import {
  Component,
  ComponentEventListener,
  ComponentEventMap,
} from '../Component.js'
import { template } from './template.js'
import { style } from './style.js'
import { Color, ColorFormat, ColorTuple4 } from './Color.js'
import { customElement } from '../../decorators/customElement.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'
import type { EnumAttr } from '../../decorators/attr.js'

interface ColorEventMap extends ComponentEventMap {
  change: CustomEvent<{ value: string }>
}

export interface BlocksColor extends Component {
  _ref: {
    $layout: HTMLDivElement
    $hsv: HTMLDivElement
    $result: HTMLDivElement
    $hueBar: HTMLDivElement
    $alphaBar: HTMLDivElement
    $hsvHue: HTMLDivElement
    $hsvButton: HTMLButtonElement
    $hueButton: HTMLButtonElement
    $alphaButton: HTMLButtonElement
    $alphaBarBg: HTMLDivElement
    $resultBg: HTMLDivElement
    $modeContent: HTMLDivElement
    $modeSwitch: HTMLButtonElement
  }

  addEventListener<K extends keyof ColorEventMap>(
    type: K,
    listener: ComponentEventListener<ColorEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ColorEventMap>(
    type: K,
    listener: ComponentEventListener<ColorEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// TODO, Firefox 拖拽 BUG
@customElement('bl-color')
@applyStyle(style)
export class BlocksColor extends Component {
  @attr('int') accessor value!: number | null

  @attr('enum', { enumValues: ['hex', 'rgb', 'hsl', 'hsv'] })
  accessor mode: EnumAttr<['hex', 'rgb', 'hsl', 'hsv']> = 'hex'

  // 设置为灰色（饱和度 s 为 0）的时候，
  // 新生成的颜色的 hue 为 0（红色），会导致面板底色突然切换到红色，
  // 所以要记住设置成灰色前的 hue，在设置灰色的时候，可以正确渲染之前的底色
  private _lastHue = 0

  private _color = Color.fromRgb(255, 0, 0)

  // alpha 通道
  get _alpha() {
    return this._color.alpha
  }

  // resize 处理器清理函数
  private _clearResizeHandler?: () => void
  // 是否正在拖拽光标取色中
  private _dragging = false
  // 是否阻止更新控制点
  private _preventUpdateControl = false
  // 是否阻止更新文本输入框
  private _preventUpdateModel = false

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

    const $layout = shadowRoot.getElementById('layout') as HTMLDivElement
    const $hsv = shadowRoot.getElementById('hsv-picker') as HTMLDivElement
    const $result = shadowRoot.getElementById('result') as HTMLDivElement
    const $hueBar = shadowRoot.getElementById('hue-bar') as HTMLDivElement
    const $alphaBar = shadowRoot.getElementById('alpha-bar') as HTMLDivElement
    const $hsvHue = $hsv.querySelector('.hue') as HTMLDivElement
    const $hsvButton = $hsv.querySelector('button') as HTMLButtonElement
    const $hueButton = $hueBar.querySelector('button') as HTMLButtonElement
    const $alphaButton = $alphaBar.querySelector('button') as HTMLButtonElement
    const $alphaBarBg = $alphaBar.querySelector('.bg') as HTMLDivElement
    const $resultBg = $result.querySelector('.bg') as HTMLDivElement
    const $modeContent = shadowRoot.getElementById(
      'mode-content'
    ) as HTMLDivElement
    const $modeSwitch = shadowRoot.getElementById(
      'mode-switch'
    ) as HTMLButtonElement
    this._ref = {
      $layout,
      $hsv,
      $result,
      $hueBar,
      $alphaBar,
      $hsvHue,
      $hsvButton,
      $hueButton,
      $alphaButton,
      $alphaBarBg,
      $resultBg,
      $modeContent,
      $modeSwitch,
    }

    // 处理鼠标取色
    this._initPickEvents()
    // 切换模式
    this._initModeChangeEvent()
    // 处理输入
    this._initInputEvents()
  }

  get hex() {
    return this._color.toString('hex')
  }

  set hex(value) {
    const newColor = Color.fromHex(value)
    const [h, s, v, alpha] = newColor.toHsva()
    this._setStates(h, s, v, alpha)
  }

  get rgb() {
    return this._color.toRgb()
  }

  set rgb([r, g, b]) {
    const newColor = Color.fromRgb(r, g, b)
    const [h, s, v] = newColor.toHsv()
    this._setStates(h, s, v, this._alpha)
  }

  get rgba(): ColorTuple4 {
    return this._color.toRgba()
  }

  set rgba([r, g, b, a]: ColorTuple4) {
    const newColor = Color.fromRgb(r, g, b, a)
    const [h, s, v] = newColor.toHsv()
    this._setStates(h, s, v, a)
  }

  get hsl() {
    return this._color.toHsl()
  }

  set hsl([hl, sl, l]) {
    const newColor = Color.fromHsl(hl, sl, l)
    const [hv, sv, v] = newColor.toHsv()
    this._setStates(hv, sv, v, this._alpha)
  }

  get hsla() {
    return this._color.toHsla()
  }

  set hsla([hl, sl, l, a]) {
    const newColor = Color.fromHsl(hl, sl, l, a)
    const [hv, sv, v, a2] = newColor.toHsva()
    this._setStates(hv, sv, v, a2)
  }

  get hsv() {
    return this._color.toHsv()
  }

  set hsv([h, s, v]) {
    this._setStates(h, s, v, this._alpha)
  }

  get hsva() {
    return this._color.toHsva()
  }

  set hsva([h, s, v, a]) {
    this._setStates(h, s, v, a)
  }

  override connectedCallback() {
    super.connectedCallback()

    this._clearResizeHandler = sizeObserve(
      this._ref.$layout,
      this._updateControls.bind(this)
    )
    this.render()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this._clearResizeHandler) {
      this._clearResizeHandler()
    }
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'mode') {
      this.render()
    }

    if (attrName === 'value') {
      if (oldValue === newValue) {
        return
      }
      const newColor = new Color(+newValue)
      const [h, s, l, v] = newColor.toHsva()
      this._setStates(h, s, l, v)
      this.render()
    }
  }

  override render() {
    this._updateControls()
    this._updateBg()
    this._updateModels()
  }

  format(fmt: ColorFormat) {
    return this._color.toString(fmt)
  }

  _updateControls() {
    if (this._preventUpdateControl) return

    const [_hue, _saturation, _value, _alpha] = this._color.toHsva()

    // 透明度
    const alphaBarWidth = this._ref.$alphaBar.clientWidth - 12
    const alphaX = _alpha * alphaBarWidth
    this._ref.$alphaButton.style.left = alphaX + 'px'
    // 色相
    const hueBarWidth = this._ref.$hueBar.clientWidth - 12
    const hueX = (_hue / 360) * hueBarWidth
    this._ref.$hueButton.style.left = hueX + 'px'
    // HSV
    const width = this._ref.$hsv.clientWidth - 12
    const height = this._ref.$hsv.clientHeight - 12
    const x = _saturation * width
    const y = height - _value * height
    this._ref.$hsvButton.style.top = y + 'px'
    this._ref.$hsvButton.style.left = x + 'px'
  }

  _setStates(hue: number, saturation: number, value: number, alpha: number) {
    // saturation 0 表示灰色，维持 hue 不变
    if (saturation === 0) {
      hue = this._lastHue
    } else {
      this._lastHue = hue
    }

    const color = Color.fromHsv(hue, saturation, value, alpha)
    const changed = !Color.equals(this._color, color)
    this._color = color

    if (changed) {
      this.value = color.value
      const payload = { detail: { value: this.value } }
      dispatchEvent(this, 'bl:color:change', payload)
      dispatchEvent(this, 'change', payload)
    }
    return changed
  }

  _updateState() {
    // 透明度
    const alphaBarWidth = this._ref.$alphaBar.clientWidth - 12
    const alphaX =
      parseInt(getComputedStyle(this._ref.$alphaButton).left, 10) || 0
    const alpha = alphaX / alphaBarWidth
    // 色相
    const hueBarWidth = this._ref.$hueBar.clientWidth - 12
    const hueX = parseInt(getComputedStyle(this._ref.$hueButton).left, 10) || 0
    const hue = Math.floor(360 * (hueX / hueBarWidth))
    // HSV
    const width = this._ref.$hsv.clientWidth - 12
    const height = this._ref.$hsv.clientHeight - 12
    const x = parseInt(getComputedStyle(this._ref.$hsvButton).left, 10) || 0
    const y = parseInt(getComputedStyle(this._ref.$hsvButton).top, 10) || 0
    const saturation = Math.floor(100 * (x / width)) / 100
    const value = 1 - Math.floor(100 * (y / height)) / 100

    return this._setStates(hue, saturation, value, alpha)
  }

  _updateBg() {
    const bg = `hsl(${this._lastHue}, 100%, 50%)`
    this._ref.$hsvHue.style.backgroundColor = bg
    this._ref.$alphaBarBg.style.backgroundImage = `linear-gradient(to right, transparent, ${bg})`
    const resultBg = this.hsla
    this._ref.$resultBg.style.backgroundColor = `hsla(${this._lastHue},${
      resultBg[1] * 100
    }%,${resultBg[2] * 100}%,${resultBg[3]})`
  }

  _updateModels() {
    // 手输的时候，避免反复触发 update（rgb 和 hsv 相互转换无法一一对应，会出现输入的数字瞬间被覆盖回去的问题）。
    if (this._preventUpdateModel) return

    const mode = this.mode
    const children = Array.prototype.slice.call(this._ref.$modeContent.children)
    const inputs = children.map($el => $el.querySelector('input'))
    const spans = children.map($el => $el.querySelector('span'))
    if (mode === 'hex') {
      children.forEach(
        ($el, index) => ($el.style.display = index === 0 ? '' : 'none')
      )
      children[0].querySelector('input').value = this.hex
      spans[0].textContent = 'HEX'
    } else if (mode === 'rgb') {
      const rgba = this.rgba
      children.forEach($el => ($el.style.display = ''))
      inputs[0].value = rgba[0]
      inputs[1].value = rgba[1]
      inputs[2].value = rgba[2]
      inputs[3].value = round(this._alpha, 2)
      spans[0].textContent = 'R'
      spans[1].textContent = 'G'
      spans[2].textContent = 'B'
      spans[3].textContent = 'A'
    } else if (mode === 'hsv') {
      const hsv = this.hsv
      children.forEach($el => ($el.style.display = ''))
      inputs[0].value = Math.round(hsv[0] % 360)
      inputs[1].value = Math.round(hsv[1] * 100) + '%'
      inputs[2].value = Math.round(hsv[2] * 100) + '%'
      inputs[3].value = round(this._alpha, 2)
      spans[0].textContent = 'H'
      spans[1].textContent = 'S'
      spans[2].textContent = 'V'
      spans[3].textContent = 'A'
    } else if (mode === 'hsl') {
      const hsla = this.hsla
      children.forEach($el => ($el.style.display = ''))
      inputs[0].value = Math.round(hsla[0] % 360)
      inputs[1].value = Math.round(hsla[1] * 100) + '%'
      inputs[2].value = Math.round(hsla[2] * 100) + '%'
      inputs[3].value = round(this._alpha, 2)
      spans[0].textContent = 'H'
      spans[1].textContent = 'S'
      spans[2].textContent = 'L'
      spans[3].textContent = 'A'
    }
  }

  // 切换模式事件
  _initModeChangeEvent() {
    this._ref.$modeSwitch.onclick = () => {
      const modes = ['hex', 'rgb', 'hsl', 'hsv'] as const
      const mode = modes[(modes.indexOf(this.mode) + 1) % 4]
      this.mode = mode
    }
  }

  // 处理输入
  _initInputEvents() {
    this._ref.$modeContent.onchange = e => {
      const $input = e.target as HTMLInputElement
      const value = $input.value || ''
      const mode = this.mode
      if (mode === 'hex') {
        if (
          /^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
        ) {
          this._preventUpdateModel = true
          this.value = Color.fromHex(value).value
          this._preventUpdateModel = false
        }
      } else if (mode === 'rgb') {
        const values = Array.prototype.map.call(
          this._ref.$modeContent.querySelectorAll('input'),
          $input => Number($input.value)
        ) as [number, number, number, number]
        if (values.every(n => n >= 0 && n <= 255)) {
          this._preventUpdateModel = true
          this.rgba = values
          this._preventUpdateModel = false
        }
      } else if (mode === 'hsv') {
        const values = Array.prototype.map.call(
          this._ref.$modeContent.querySelectorAll('input'),
          $input => parseFloat($input.value)
        ) as [number, number, number, number]
        if (values[0] < 0 || values[0] > 360) return
        if (values[1] < 0 || values[1] > 100) return
        if (values[2] < 0 || values[2] > 100) return
        if (values[3] < 0 || values[3] > 1) return
        this._preventUpdateModel = true
        this.hsva = [values[0], values[1] / 100, values[2] / 100, values[3]]
        this._preventUpdateModel = false
      } else if (mode === 'hsl') {
        const values = Array.prototype.map.call(
          this._ref.$modeContent.querySelectorAll('input'),
          $input => parseFloat($input.value)
        ) as [number, number, number, number]
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

  // 处理鼠标取色
  _initPickEvents() {
    this._dragging = false
    let $button: HTMLElement | null = null
    let wrapWidth: number | null = null
    let wrapHeight: number | null = null
    let positionStart: { x: number; y: number } | null = null

    const update = () => {
      this._preventUpdateControl = true
      this._updateState()
      this._preventUpdateControl = false
    }

    const onMove = ({ offset, preventDefault }: any) => {
      preventDefault()
      let x = positionStart!.x + offset.x
      let y = positionStart!.y + offset.y
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > wrapWidth! - 12) x = wrapWidth! - 12
      if (y > wrapHeight! - 12) y = wrapHeight! - 12

      $button!.style.left = x + 'px'
      $button!.style.top = y + 'px'

      update()
    }

    const onEnd = () => {
      update()
      positionStart = null
      wrapWidth = null
      wrapHeight = null
      this._dragging = false
    }

    const onStart = ({ start, $target }: any) => {
      this._dragging = true

      const $wrap = [
        this._ref.$hueBar,
        this._ref.$alphaBar,
        this._ref.$hsv,
      ].find($wrap => $wrap.contains($target))
      $button = $wrap!.querySelector('button') as HTMLElement

      const rect = $wrap!.getBoundingClientRect()
      wrapWidth = rect.width
      wrapHeight = rect.height

      let x = start.clientX - rect.x - 6
      let y = start.clientY - rect.y - 6
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > wrapWidth! - 12) x = wrapWidth! - 12
      if (y > wrapHeight! - 12) y = wrapHeight! - 12

      positionStart = { x, y }
      $button.style.left = x + 'px'
      $button.style.top = y + 'px'

      update()
    }

    const options = {
      onStart,
      onMove,
      onEnd,
    }
    onDragMove(this._ref.$hueBar, options)
    onDragMove(this._ref.$alphaBar, options)
    onDragMove(this._ref.$hsv, options)
  }
}
