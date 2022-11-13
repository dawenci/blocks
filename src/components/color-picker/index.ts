import { BlocksPopup } from '../popup/index.js'
import { BlocksColor } from '../color/index.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { dispatchEvent } from '../../common/event.js'
import { uniqId } from '../../common/uniqId.js'
import {
  disabledGetter,
  disabledSetter,
} from '../../common/propertyAccessor.js'
import { Component } from '../Component.js'
import { template } from './template.js'

export interface BlocksColorPicker extends Component {
  _ref: {
    $result: HTMLDivElement
    $icon: HTMLElement
    $popup: BlocksPopup
    $color: BlocksColor
  }
}

export class BlocksColorPicker extends Component {
  #clearClickOutside?: () => void

  static override get observedAttributes() {
    return ['value', 'disabled', 'size']
  }

  constructor() {
    super()
    this.id = `color-picker-${uniqId()}`

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const { inputTemplate, popupTemplate } = template()

    // input 部分
    const fragment = inputTemplate.content.cloneNode(true) as DocumentFragment
    shadowRoot.appendChild(fragment)
    const $result = shadowRoot.querySelector('#result') as HTMLDivElement
    const $icon = $result.querySelector('bl-icon') as HTMLElement
    // 面板部分
    const $popup = (
      popupTemplate.content.cloneNode(true) as HTMLElement
    ).querySelector('bl-popup') as BlocksPopup

    const $color = $popup.querySelector('bl-color') as BlocksColor

    this._ref = {
      $result,
      $icon,
      $popup,
      $color,
    }

    $popup.anchor = () => $result
    ;($result as any).onfocus = $result.onclick = () => {
      if (this.disabled) return
      $popup.open = true
      $color.render()
    }

    $color.addEventListener('change', () => {
      this.value = $color.value
      this.render()
      dispatchEvent(this, 'change')
    })

    $popup.addEventListener('opened', () => {
      this.#initClickOutside()
    })

    $popup.addEventListener('closed', () => {
      this.#destroyClickOutside()
    })
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get hex() {
    return this._ref.$color.hex
  }

  set hex(value) {
    this._ref.$color.hex = value
  }

  get hsl() {
    return this._ref.$color.hsl
  }

  set hsl(value) {
    this._ref.$color.hsl = value
  }

  get hsla() {
    return this._ref.$color.hsla
  }

  set hsla(value) {
    this._ref.$color.hsla = value
  }

  get hsv() {
    return this._ref.$color.hsv
  }

  set hsv(value) {
    this._ref.$color.hsv = value
  }

  get hsva() {
    return this._ref.$color.hsva
  }

  set hsva(value) {
    this._ref.$color.hsva = value
  }

  get rgb() {
    return this._ref.$color.rgb
  }

  set rgb(value) {
    this._ref.$color.rgb = value
  }

  get rgba() {
    return this._ref.$color.rgba
  }

  set rgba(value) {
    this._ref.$color.rgba = value
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(value) {
    if (value !== null) this.setAttribute('value', value)
  }

  override connectedCallback() {
    super.connectedCallback()

    super.connectedCallback()
    document.body.appendChild(this._ref.$popup)
    this.render()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()

    document.body.removeChild(this._ref.$popup)
    this.#destroyClickOutside()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (['clearable'].includes(attrName)) {
      this._ref.$result.setAttribute(attrName, newValue)
    }

    if (attrName === 'value') {
      if (oldValue !== newValue) {
        this._ref.$color.setAttribute('value', newValue)
      }
    }

    this.render()
  }

  override render() {
    const hsla = this._ref.$color.hsla
    if (hsla) {
      this._ref.$result.style.backgroundColor = `hsla(${hsla[0]},${
        hsla[1] * 100
      }%,${hsla[2] * 100}%,${hsla[3]})`
      // 下拉箭头，根据背景亮度设置深色或浅色
      let lightness = hsla[2] * 100
      // 黄色到青色区间亮度太高，优先使用暗色箭头
      if (hsla[0] > 50 && hsla[0] < 195) {
        lightness = lightness > 40 ? 0 : 100
      } else {
        lightness = lightness > 50 ? 10 : 90
      }
      ;(this._ref.$icon as any).fill = `hsla(${hsla[0]},${50}%,${lightness}%,1)`
    }
  }

  toHexString() {
    return this._ref.$color.toHexString()
  }

  toRgbString() {
    return this._ref.$color.toRgbString()
  }

  toRgbaString() {
    return this._ref.$color.toRgbaString()
  }

  toHslString() {
    return this._ref.$color.toHslString()
  }

  toHslaString() {
    return this._ref.$color.toHslaString()
  }

  toHsvString() {
    return this._ref.$color.toHsvString()
  }

  toHsvaString() {
    return this._ref.$color.toHsvaString()
  }

  #initClickOutside() {
    if (!this.#clearClickOutside) {
      this.#clearClickOutside = onClickOutside([this, this._ref.$color], () => {
        if (this._ref.$popup.open) this._ref.$popup.open = false
      })
    }
  }

  #destroyClickOutside() {
    if (this.#clearClickOutside) {
      this.#clearClickOutside()
      this.#clearClickOutside = undefined
    }
  }
}

if (!customElements.get('bl-color-picker')) {
  customElements.define('bl-color-picker', BlocksColorPicker)
}
