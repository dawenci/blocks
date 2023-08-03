import type { ColorFormat } from '../color/Color.js'
import '../color/index.js'
import '../select-result/index.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { intGetter, intSetter } from '../../common/property.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { popupTemplate, resultTemplate } from './template.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { BlPopup } from '../popup/index.js'
import { BlColor } from '../color/index.js'
import { Color } from '../color/Color.js'
import { BlControl } from '../base-control/index.js'
import { BlSelectResult } from '../select-result/index.js'
import {
  PROXY_POPUP_ACCESSORS,
  PROXY_POPUP_ACCESSORS_KEBAB,
  PROXY_RESULT_ACCESSORS,
  PROXY_RESULT_ACCESSORS_KEBAB,
} from '../../common/constants.js'

export interface BlColorPicker
  extends BlControl,
    Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>,
    Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
  $popup: BlPopup
  $color: BlColor
  defaultColor?: number
}

@defineClass({
  customElement: 'bl-color-picker',
  styles: [style],
  proxyAccessors: [
    { klass: BlPopup, names: PROXY_POPUP_ACCESSORS },
    { klass: BlSelectResult, names: PROXY_RESULT_ACCESSORS },
  ],
})
export class BlColorPicker extends BlControl {
  static override get observedAttributes(): readonly string[] {
    return [...BlColor.observedAttributes, ...PROXY_POPUP_ACCESSORS_KEBAB, ...PROXY_RESULT_ACCESSORS_KEBAB]
  }

  @attr('string', { defaults: 'rgba' }) accessor formatString!: ColorFormat
  @attr('int', {
    defaults: Color.RED.value,
    get(self) {
      return intGetter('value')(self)
    },
    set(self, value) {
      intSetter('value')(self, value)
      if (!self.defaultColor) {
        self.defaultColor = self.value
      }
    },
  })
  accessor value!: number
  @attr('boolean') accessor open!: boolean
  @attr('boolean') accessor clearable!: boolean

  @shadowRef('bl-select-result') accessor $result!: BlSelectResult

  get $arrowWrapper() {
    return this.$result.$suffix
  }

  constructor() {
    super()
    this.appendShadowChild(resultTemplate())
    this._disabledFeature.withTarget(() => [this, this.$result])
    this._tabIndexFeature
      .withTabIndex(0)
      .withDisabledPredicate(() => this.disabled)
      .withTarget(() => [this.$result])

    this.#setupPopup()
    this.#setupResult()
    this.#setupAria()
    this.defaultColor = this.value
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

  format(fmt: ColorFormat) {
    return this.$color.format(fmt)
  }

  #setupPopup() {
    this.$popup = popupTemplate()
    this.$color = this.$popup.querySelector('bl-color') as BlColor
    this.$popup.anchorElement = () => this.$result

    this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, newValue) => {
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
      const payload = { detail: this.$color.value }
      dispatchEvent(this, 'bl:color-picker:change', payload)
      dispatchEvent(this, 'change', payload)
    }

    this.hook.onConnected(() => {
      this.$color.addEventListener('bl:color:change', onColorChange)
      this.$popup.addEventListener('opened', setupClickOutside)
      this.$popup.addEventListener('closed', destroyClickOutside)
    })

    this.hook.onDisconnected(() => {
      document.body.removeChild(this.$popup)
      this.$color.removeEventListener('bl:color:change', onColorChange)
      this.$popup.removeEventListener('opened', setupClickOutside)
      this.$popup.removeEventListener('closed', destroyClickOutside)
      destroyClickOutside()
    })

    this.hook.onAttributeChangedDep('value', (name, old, val) => {
      if (old !== val) {
        this.$color.setAttribute('value', val as string)
      }
    })
  }

  #setupResult() {
    const update = () => {
      const hsla = this.$color.hsla
      if (hsla) {
        this.$result.$layout.style.backgroundColor = `hsla(${hsla[0]},${hsla[1] * 100}%,${hsla[2] * 100}%,${hsla[3]})`
        // 下拉箭头，根据背景亮度设置深色或浅色
        let lightness = hsla[2] * 100
        // 黄色到青色区间亮度太高，优先使用暗色箭头
        if (hsla[0] > 50 && hsla[0] < 195) {
          lightness = lightness > 40 ? 0 : 100
        } else {
          lightness = lightness > 50 ? 10 : 90
        }
        this.$result.data = [
          {
            value: this.$color.value,
            label: this.format(this.formatString),
          },
        ]

        const fg = `hsla(${hsla[0]},${50}%,${lightness}%,1)`
        this.$result.style.color = fg
        this.$arrowWrapper!.style.fill = fg
        if (this.$result.$clear) {
          this.$result.$clear.style.setProperty('--fg', fg)
          this.$result.$clear.style.setProperty('--fg-hover', fg)
          this.$result.$clear.style.setProperty('--fg-active', fg)
        }
      }
    }
    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDeps(['value', 'size'], update)

    const onResultTrigger = () => {
      this.open = true
      this.$color.render()
    }
    this.hook.onConnected(() => {
      this.$result.onfocus = this.$result.onclick = onResultTrigger
    })
    this.hook.onDisconnected(() => {
      this.$result.onfocus = this.$result.onclick = null
    })

    // 渲染箭头
    const renderDropdownArrow = () => {
      this.$result.classList.toggle('dropdown', this.open)
    }
    this.hook.onConnected(renderDropdownArrow)
    this.hook.onDisconnected(renderDropdownArrow)
    this.hook.onAttributeChangedDep('open', renderDropdownArrow)

    this.hook.onAttributeChangedDeps(PROXY_RESULT_ACCESSORS_KEBAB, (name, _, newValue) => {
      this.$result.setAttribute(name, newValue as string)
    })

    const onClear = () => {
      if (this.defaultColor) {
        this.value = this.defaultColor
      }
      dispatchEvent(this, 'select-result:clear')
    }
    this.hook.onConnected(() => {
      this.addEventListener('click-clear', onClear)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('click-clear', onClear)
    })
  }

  #setupAria() {
    this.hook.onConnected(() => {
      this.setAttribute('aria-haspopup', 'true')
    })
  }
}
