import type { ColorFormat } from '../color/Color.js'
import '../color/index.js'
import '../icon/index.js'
import '../input/index.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { resultTemplate, popupTemplate } from './template.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { style } from './style.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksColor } from '../color/index.js'
import { Color } from '../color/Color.js'
import { Control } from '../base-control/index.js'

export interface BlocksColorPicker extends Control {
  $popup: BlocksPopup
  $color: BlocksColor
}

@defineClass({
  customElement: 'bl-color-picker',
  styles: [style],
})
export class BlocksColorPicker extends Control {
  static override get observedAttributes(): readonly string[] {
    return [...BlocksColor.observedAttributes, ...BlocksPopup.observedAttributes]
  }

  static override get disableEventTypes(): readonly string[] {
    return ['click']
  }

  @attr('int', { defaults: Color.RED.value }) accessor value!: number
  @attr('boolean') accessor open!: boolean

  @shadowRef('#layout') accessor $layout!: HTMLElement
  @shadowRef('#layout bl-icon') accessor $icon!: HTMLElement

  constructor() {
    super()
    this.appendShadowChild(resultTemplate())
    this._tabIndexFeature.withTabIndex(0)

    this.#setupPopup()
    this.#setupResult()
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

  override render() {
    super.render()
    const hsla = this.$color.hsla
    if (hsla) {
      this.$layout.style.backgroundColor = `hsla(${hsla[0]},${hsla[1] * 100}%,${hsla[2] * 100}%,${hsla[3]})`
      // 下拉箭头，根据背景亮度设置深色或浅色
      let lightness = hsla[2] * 100
      // 黄色到青色区间亮度太高，优先使用暗色箭头
      if (hsla[0] > 50 && hsla[0] < 195) {
        lightness = lightness > 40 ? 0 : 100
      } else {
        lightness = lightness > 50 ? 10 : 90
      }
      ;(this.$icon as any).fill = `hsla(${hsla[0]},${50}%,${lightness}%,1)`
    }
  }

  format(fmt: ColorFormat) {
    return this.$color.format(fmt)
  }

  #setupPopup() {
    this.$popup = popupTemplate()
    this.$color = this.$popup.querySelector('bl-color') as BlocksColor
    this.$popup.anchorElement = () => this.$layout

    this.onAttributeChangedDeps(BlocksPopup.observedAttributes, (name, _, newValue) => {
      if (name === 'open') {
        // 首次打开的时候，挂载 $popup 的 DOM
        if (this.open && !document.body.contains(this.$popup)) {
          document.body.appendChild(this.$popup)
        }
        this.$popup.open = this.open
      } else {
        this.$popup.setAttribute(name, newValue as string)
      }
    })

    let clear: (() => void) | undefined
    const setupClickOutside = () => {
      if (!clear) {
        clear = onClickOutside([this, this.$color], () => {
          if (this.open) this.open = false
        })
      }
    }
    const destroyClickOutside = () => {
      if (clear) {
        clear()
        clear = undefined
      }
    }

    const onColorChange = () => {
      this.value = this.$color.value
      this.render()
      const payload = { detail: this.$color.value }
      dispatchEvent(this, 'bl:color-picker:change', payload)
      dispatchEvent(this, 'change', payload)
    }

    this.onConnected(() => {
      // document.body.appendChild(this.$popup)
      this.$color.addEventListener('bl:color:change', onColorChange)
      this.$popup.addEventListener('opened', setupClickOutside)
      this.$popup.addEventListener('closed', destroyClickOutside)
    })

    this.onDisconnected(() => {
      document.body.removeChild(this.$popup)
      this.$color.removeEventListener('bl:color:change', onColorChange)
      this.$popup.removeEventListener('opened', setupClickOutside)
      this.$popup.removeEventListener('closed', destroyClickOutside)
      destroyClickOutside()
    })

    this.onAttributeChangedDep('value', (name, old, val) => {
      if (old !== val) {
        this.$color.setAttribute('value', val as string)
      }
    })

    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
  }

  #setupResult() {
    const onResultTrigger = () => {
      this.open = true
      this.$color.render()
    }
    this.onConnected(() => {
      this.$layout.onfocus = this.$layout.onclick = onResultTrigger
    })
    this.onDisconnected(() => {
      this.$layout.onfocus = this.$layout.onclick = null
    })

    // this.onAttributeChangedDep('clearable', (name, _, val) => {
    //   this.$layout.setAttribute(name, val as string)
    // })

    // 渲染箭头
    const renderDropdownArrow = () => {
      this.$layout.classList.toggle('dropdown', this.open)
    }
    this.onConnected(renderDropdownArrow)
    this.onDisconnected(renderDropdownArrow)
    this.onAttributeChangedDep('open', renderDropdownArrow)
  }
}
