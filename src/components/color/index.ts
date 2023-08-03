import type { ColorFormat, ColorTuple4 } from './Color.js'
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import { attr } from '../../decorators/attr/index.js'
import { onDragMove } from '../../common/onDragMove.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { round } from '../../common/utils.js'
import { sizeObserve } from '../../common/sizeObserve.js'
import { style } from './style.js'
import { template } from './template.js'
import { Color } from './Color.js'
import { BlComponent } from '../component/Component.js'
import { IReactive, reactive, subscribe, unsubscribe } from '../../common/reactive.js'

export interface BlColorEventMap extends BlComponentEventMap {
  change: CustomEvent<{ value: string }>
}

export interface BlColor extends BlComponent {
  addEventListener<K extends keyof BlColorEventMap>(
    type: K,
    listener: BlComponentEventListener<BlColorEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlColorEventMap>(
    type: K,
    listener: BlComponentEventListener<BlColorEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

const POINT_SIZE = 12

@defineClass({
  customElement: 'bl-color',
  styles: [style],
})
export class BlColor extends BlComponent {
  @attr('int', { defaults: Color.RED.value }) accessor value!: number

  @attr('enum', { enumValues: ['hex', 'rgb', 'hsl', 'hsv'] })
  accessor mode: OneOf<['hex', 'rgb', 'hsl', 'hsv']> = 'hex'

  @shadowRef('#layout') accessor $layout!: HTMLDivElement
  @shadowRef('#hsv-picker') accessor $hsv!: HTMLDivElement
  @shadowRef('#result') accessor $result!: HTMLDivElement
  @shadowRef('#hue-bar') accessor $hueBar!: HTMLDivElement
  @shadowRef('#alpha-bar') accessor $alphaBar!: HTMLDivElement
  @shadowRef('#hsv-picker .hue') accessor $hsvHue!: HTMLDivElement
  @shadowRef('#hsv-picker button') accessor $hsvButton!: HTMLButtonElement
  @shadowRef('#hue-bar button') accessor $hueButton!: HTMLButtonElement
  @shadowRef('#alpha-bar button') accessor $alphaButton!: HTMLButtonElement
  @shadowRef('#alpha-bar .bg') accessor $alphaBarBg!: HTMLDivElement
  @shadowRef('#result .bg') accessor $resultBg!: HTMLDivElement
  @shadowRef('#mode-content') accessor $modeContent!: HTMLDivElement
  @shadowRef('#mode-switch') accessor $modeSwitch!: HTMLButtonElement

  #h: IReactive<number>
  #s: IReactive<number>
  #v: IReactive<number>
  #alpha: IReactive<number>

  constructor() {
    super()

    this.appendShadowChild(template())

    const initColor = new Color(this.value)
    const initHsv = initColor.toHsv()
    this.#h = reactive(initHsv[0])
    this.#s = reactive(initHsv[1])
    this.#v = reactive(initHsv[2])
    this.#alpha = reactive(initColor.alpha)

    this.#setupBg()
    this.#setupControls()
    this.#setupInputs()
    this.#setupInputEvents()
    this.#setupValueAttr()
  }

  // 是否正在拖拽光标取色中
  #dragging = false

  // 是否阻止更新控制点
  // 拖拽过程，阻止通过数据变更触发控制点座标绘制，UI 更新交给鼠标拖拽控制即可
  #preventRenderControlByDataChange = false

  // 是否阻止更新文本输入框
  // 手输的时候，避免反复触发 update（rgb 和 hsv 相互转换无法一一对应，会出现输入的数字瞬间被覆盖回去的问题）。
  #preventRenderInputByDataChange = false

  get color() {
    return Color.fromHsv(this.#h.content, this.#s.content, this.#v.content, this.#alpha.content)
  }

  get hex() {
    return this.color.toString('hex')
  }

  set hex(value) {
    this.setColor(Color.fromHex(value))
  }

  get rgb() {
    return this.color.toRgb()
  }

  set rgb([r, g, b]) {
    this.setColor(Color.fromRgb(r, g, b, this.#alpha.content))
  }

  get rgba(): ColorTuple4 {
    return this.color.toRgba()
  }

  set rgba([r, g, b, a]: ColorTuple4) {
    this.setColor(Color.fromRgb(r, g, b, a))
  }

  get hsl() {
    return this.color.toHsl()
  }

  set hsl([hl, sl, l]) {
    this.setColor(Color.fromHsl(hl, sl, l, this.#alpha.content))
  }

  get hsla() {
    return this.color.toHsla()
  }

  set hsla([hl, sl, l, a]) {
    this.setColor(Color.fromHsl(hl, sl, l, a))
  }

  get hsv() {
    return [this.#h.content, this.#s.content, this.#v.content]
  }

  set hsv([h, s, v]) {
    this.setColor(Color.fromHsv(h, s, v, this.#alpha.content))
  }

  get hsva() {
    return [this.#h.content, this.#s.content, this.#v.content, this.#alpha.content]
  }

  set hsva([h, s, v, a]) {
    this.setColor(Color.fromHsv(h, s, v, a))
  }

  // 灰色处理
  // 颜色选择灰色时，因为生成的 Color 对象，其 hue 会永远为 0（红色），这会导致颜色面板底色、突然从原来的颜色系切换到红色。
  // 为了避免这个问题，需要每次选择颜色的时候，将最新的 hue 记录下来用于渲染，以便在后续选择灰色时，可以维持底色色系不变。
  // 灰色的判断，以 hsv 模式为例子，saturation 0 即表示灰色
  // 另外，在灰色状态下，拖拽 hue 控制点的时候，也要更新 hue
  // #hue = this.#color.content.toHsv()[0]
  setColor(color: Color) {
    const [hue, saturation, value] = color.toHsv()
    const alpha = color.alpha

    let shouldRender = false
    if (saturation === 0) {
      shouldRender = true
      this.#h.content = this.#calcHueByControlPoint()
    }

    if (
      this.#h.content === hue &&
      this.#s.content == saturation &&
      this.#v.content === value &&
      this.#alpha.content === alpha
    ) {
      if (shouldRender) {
        this.render()
        return true
      }
      return false
    }

    this.#h.content = hue
    this.#s.content = saturation
    this.#v.content = value
    this.#alpha.content = alpha
    if (this.value !== color.value) this.value = color.value
    const payload = { detail: { value: this.value } }
    dispatchEvent(this, 'bl:color:change', payload)
    dispatchEvent(this, 'change', payload)

    this.render()
    return true
  }

  format(fmt: ColorFormat) {
    return this.color.toString(fmt)
  }

  // 拖拽控制点
  #setupControls() {
    // 通过 model（this.#h）渲染控制点
    const renderHue = () => {
      if (this.#preventRenderControlByDataChange) return
      const hueBarWidth = this.$hueBar.clientWidth - POINT_SIZE
      const hueX = (this.#h.content / 360) * hueBarWidth
      this.$hueButton.style.left = hueX + 'px'
    }

    // 通过 model（this.#s）渲染控制点
    const renderSaturation = () => {
      if (this.#preventRenderControlByDataChange) return
      const width = this.$hsv.clientWidth - POINT_SIZE
      const x = this.#s.content * width
      this.$hsvButton.style.left = x + 'px'
    }

    // 通过 model（this.#v）渲染控制点
    const renderValue = () => {
      if (this.#preventRenderControlByDataChange) return
      const height = this.$hsv.clientHeight - POINT_SIZE
      const y = height - this.#v.content * height
      this.$hsvButton.style.top = y + 'px'
    }

    // 通过 model（this.#alpha）渲染控制点
    const renderAlpha = () => {
      if (this.#preventRenderControlByDataChange) return
      const alphaBarWidth = this.$alphaBar.clientWidth - POINT_SIZE
      const alphaX = this.#alpha.content * alphaBarWidth
      this.$alphaButton.style.left = alphaX + 'px'
    }

    this.hook.onConnected(() => {
      subscribe(this.#h, renderHue)
      subscribe(this.#s, renderSaturation)
      subscribe(this.#v, renderValue)
      subscribe(this.#alpha, renderAlpha)
    })
    this.hook.onDisconnected(() => {
      unsubscribe(this.#h, renderHue)
      unsubscribe(this.#s, renderSaturation)
      unsubscribe(this.#v, renderValue)
      unsubscribe(this.#alpha, renderAlpha)
    })

    const render = () => {
      renderHue()
      renderSaturation()
      renderValue()
      renderAlpha()
    }
    this.hook.onRender(render)
    this.hook.onConnected(render)

    let clear: () => void
    this.hook.onConnected(() => {
      clear = sizeObserve(this.$layout, render)
    })
    this.hook.onDisconnected(() => {
      if (clear) clear()
    })

    // 通过拖拽控制点位置变化，更新各个 model
    const updateState = () => {
      const hue = this.#calcHueByControlPoint()
      const saturation = this.#calcSaturationByControlPoint()
      const value = this.#calcValueByControlPoint()
      const alpha = this.#calcAlphaByControlPoint()
      return this.setColor(Color.fromHsv(hue, saturation, value, alpha))
    }

    // 拖拽过程，阻止通过数据变更触发控制点座标绘制，UI 更新交给鼠标拖拽控制即可
    const update = () => {
      this.#preventRenderControlByDataChange = true
      updateState()
      this.#preventRenderControlByDataChange = false
    }

    this.#dragging = false
    this.#preventRenderControlByDataChange = false
    let $activePoint: HTMLElement | null = null
    let wrapWidth: number | null = null
    let wrapHeight: number | null = null
    let positionStart: { x: number; y: number } | null = null

    const onStart = ({ start, $target }: any) => {
      this.#dragging = true

      const $wrap = [this.$hueBar, this.$alphaBar, this.$hsv].find($wrap => $wrap.contains($target))!
      $activePoint = $wrap.querySelector<HTMLElement>('button')!

      const rect = $wrap.getBoundingClientRect()
      wrapWidth = rect.width
      wrapHeight = rect.height

      let x = start.clientX - rect.x - 6
      let y = start.clientY - rect.y - 6
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > wrapWidth - POINT_SIZE) x = wrapWidth - POINT_SIZE
      if (y > wrapHeight - POINT_SIZE) y = wrapHeight - POINT_SIZE

      positionStart = { x, y }
      $activePoint.style.left = x + 'px'
      $activePoint.style.top = y + 'px'

      update()
    }

    const onMove = ({ offset, preventDefault }: any) => {
      preventDefault()
      let x = positionStart!.x + offset.x
      let y = positionStart!.y + offset.y
      if (x < 0) x = 0
      if (y < 0) y = 0
      if (x > wrapWidth! - POINT_SIZE) x = wrapWidth! - POINT_SIZE
      if (y > wrapHeight! - POINT_SIZE) y = wrapHeight! - POINT_SIZE

      $activePoint!.style.left = x + 'px'
      $activePoint!.style.top = y + 'px'

      update()
    }

    const onEnd = () => {
      update()
      positionStart = null
      wrapWidth = null
      wrapHeight = null
      this.#dragging = false
    }

    const options = {
      onStart,
      onMove,
      onEnd,
    }
    onDragMove(this.$hueBar, options)
    onDragMove(this.$alphaBar, options)
    onDragMove(this.$hsv, options)
  }

  // 色板背景、选择结果背景
  #setupBg() {
    const renderHsvBg = () => {
      const h = this.#h.content
      const bgColor = `hsl(${h}, 100%, 50%)`
      const bgImage = `linear-gradient(to right, transparent, ${bgColor})`
      this.$hsvHue.style.backgroundColor = bgColor
      this.$alphaBarBg.style.backgroundImage = bgImage
    }
    const renderResultBg = () => {
      const h = this.#h.content
      const [, s, l, a] = this.hsla
      this.$resultBg.style.backgroundColor = `hsla(${h},${s * 100}%,${l * 100}%,${a})`
    }
    this.hook.onConnected(() => {
      subscribe(this.#h, renderHsvBg)
      subscribe(this.#h, renderResultBg)
      subscribe(this.#s, renderResultBg)
      subscribe(this.#v, renderResultBg)
      subscribe(this.#alpha, renderResultBg)
    })
    this.hook.onDisconnected(() => {
      unsubscribe(this.#h, renderHsvBg)
      unsubscribe(this.#h, renderResultBg)
      unsubscribe(this.#s, renderResultBg)
      unsubscribe(this.#v, renderResultBg)
      unsubscribe(this.#alpha, renderResultBg)
    })

    const render = () => {
      renderHsvBg()
      renderResultBg()
    }
    this.hook.onRender(render)
    this.hook.onConnected(render)
  }

  // 各个颜色分量输入框
  #setupInputs() {
    const renderHex = () => {
      if (this.#preventRenderInputByDataChange) return
      const children = Array.prototype.slice.call(this.$modeContent.children)
      const spans = children.map($el => $el.querySelector('span'))
      children.forEach(($el, index) => ($el.style.display = index === 0 ? '' : 'none'))
      children[0].querySelector('input').value = this.hex
      spans[0].textContent = 'HEX'
    }
    const renderRgb = () => {
      if (this.#preventRenderInputByDataChange) return
      const children = Array.prototype.slice.call(this.$modeContent.children)
      const inputs = children.map($el => $el.querySelector('input'))
      const spans = children.map($el => $el.querySelector('span'))
      const rgba = this.rgba
      children.forEach($el => ($el.style.display = ''))
      inputs[0].value = rgba[0]
      inputs[1].value = rgba[1]
      inputs[2].value = rgba[2]
      inputs[3].value = round(this.#alpha.content, 2)
      spans[0].textContent = 'R'
      spans[1].textContent = 'G'
      spans[2].textContent = 'B'
      spans[3].textContent = 'A'
    }
    const renderHsv = () => {
      if (this.#preventRenderInputByDataChange) return
      const children = Array.prototype.slice.call(this.$modeContent.children)
      const inputs = children.map($el => $el.querySelector('input'))
      const spans = children.map($el => $el.querySelector('span'))
      const hsv = this.hsv
      children.forEach($el => ($el.style.display = ''))
      inputs[0].value = Math.round(hsv[0] % 360)
      inputs[1].value = Math.round(hsv[1] * 100) + '%'
      inputs[2].value = Math.round(hsv[2] * 100) + '%'
      inputs[3].value = round(this.#alpha.content, 2)
      spans[0].textContent = 'H'
      spans[1].textContent = 'S'
      spans[2].textContent = 'V'
      spans[3].textContent = 'A'
    }
    const renderHsl = () => {
      if (this.#preventRenderInputByDataChange) return
      const children = Array.prototype.slice.call(this.$modeContent.children)
      const inputs = children.map($el => $el.querySelector('input'))
      const spans = children.map($el => $el.querySelector('span'))
      const hsla = this.hsla
      children.forEach($el => ($el.style.display = ''))
      inputs[0].value = Math.round(hsla[0] % 360)
      inputs[1].value = Math.round(hsla[1] * 100) + '%'
      inputs[2].value = Math.round(hsla[2] * 100) + '%'
      inputs[3].value = round(this.#alpha.content, 2)
      spans[0].textContent = 'H'
      spans[1].textContent = 'S'
      spans[2].textContent = 'L'
      spans[3].textContent = 'A'
    }
    const render = () => {
      switch (this.mode) {
        case 'hex':
          return renderHex()
        case 'rgb':
          return renderRgb()
        case 'hsv':
          return renderHsv()
        case 'hsl':
          return renderHsl()
      }
    }
    this.hook.onConnected(() => {
      subscribe(this.#h, render)
      subscribe(this.#s, render)
      subscribe(this.#v, render)
      subscribe(this.#alpha, render)
    })
    this.hook.onDisconnected(() => {
      unsubscribe(this.#h, render)
      unsubscribe(this.#s, render)
      unsubscribe(this.#v, render)
      unsubscribe(this.#alpha, render)
    })
    this.hook.onRender(render)
    this.hook.onConnected(render)

    // 切换模式事件
    const onClick = () => {
      const modes = ['hex', 'rgb', 'hsl', 'hsv'] as const
      const mode = modes[(modes.indexOf(this.mode) + 1) % 4]
      this.mode = mode
    }
    this.hook.onConnected(() => {
      this.$modeSwitch.onclick = onClick
    })
    this.hook.onDisconnected(() => {
      this.$modeSwitch.onclick = null
    })
    this.hook.onAttributeChangedDep('mode', render)
  }

  // 处理输入
  #setupInputEvents() {
    const onHexChange = () => {
      const $input = this.$modeContent.querySelector('input')!
      const value = $input.value || ''
      if (/^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
        this.#preventRenderInputByDataChange = true
        this.value = Color.fromHex(value).value
        // console.log(Color.fromHex(value).toString('hex'))
        this.#preventRenderInputByDataChange = false
      }
    }
    const onRgbChange = () => {
      const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input =>
        Number($input.value)
      ) as [number, number, number, number]
      if (values.every(n => n >= 0 && n <= 255)) {
        this.#preventRenderInputByDataChange = true
        this.rgba = values
        this.#preventRenderInputByDataChange = false
      }
    }
    const onHsvChange = () => {
      const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input =>
        parseFloat($input.value)
      ) as [number, number, number, number]
      if (values[0] < 0 || values[0] > 360) return
      if (values[1] < 0 || values[1] > 100) return
      if (values[2] < 0 || values[2] > 100) return
      if (values[3] < 0 || values[3] > 1) return
      this.#preventRenderInputByDataChange = true
      this.hsva = [values[0], values[1] / 100, values[2] / 100, values[3]]
      this.#preventRenderInputByDataChange = false
    }
    const onHslChange = () => {
      const values = Array.prototype.map.call(this.$modeContent.querySelectorAll('input'), $input =>
        parseFloat($input.value)
      ) as [number, number, number, number]
      if (values[0] < 0 || values[0] > 360) return
      if (values[1] < 0 || values[1] > 100) return
      if (values[2] < 0 || values[2] > 100) return
      if (values[3] < 0 || values[3] > 1) return
      this.#preventRenderInputByDataChange = true
      this.hsla = [values[0], values[1] / 100, values[2] / 100, values[3]]
      this.#preventRenderInputByDataChange = false
    }
    const onChange = () => {
      switch (this.mode) {
        case 'hex':
          onHexChange()
          return
        case 'rgb':
          onRgbChange()
          return
        case 'hsv':
          onHsvChange()
          return
        case 'hsl':
          onHslChange()
          return
      }
    }
    this.hook.onConnected(() => {
      this.$modeContent.onchange = onChange
    })
    this.hook.onDisconnected(() => {
      this.$modeContent.onchange = null
    })
  }

  #calcHueByControlPoint() {
    // 色相
    const hueBarWidth = this.$hueBar.clientWidth - POINT_SIZE
    const hueX = parseInt(getComputedStyle(this.$hueButton).left, 10) || 0
    const hue = Math.floor(360 * (hueX / hueBarWidth))
    return hue
  }
  #calcAlphaByControlPoint() {
    // 透明度
    const alphaBarWidth = this.$alphaBar.clientWidth - POINT_SIZE
    const alphaX = parseInt(getComputedStyle(this.$alphaButton).left, 10) || 0
    const alpha = alphaX / alphaBarWidth
    return alpha
  }
  #calcSaturationByControlPoint() {
    const width = this.$hsv.clientWidth - POINT_SIZE
    const x = parseInt(getComputedStyle(this.$hsvButton).left, 10) || 0
    const saturation = Math.floor(100 * (x / width)) / 100
    return saturation
  }
  #calcValueByControlPoint() {
    const height = this.$hsv.clientHeight - POINT_SIZE
    const y = parseInt(getComputedStyle(this.$hsvButton).top, 10) || 0
    const value = 1 - Math.floor(100 * (y / height)) / 100
    return value
  }

  #setupValueAttr() {
    this.hook.onAttributeChangedDep('value', () => {
      const newColor = new Color(this.value)
      this.setColor(newColor)
    })
  }
}
