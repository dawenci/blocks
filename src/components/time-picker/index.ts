import '../popup/index.js'
import '../time/index.js'
import { attr } from '../../decorators/attr.js'
import { boolSetter } from '../../common/property.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { padLeft } from '../../common/utils.js'
import { style } from './style.js'
import { template } from './template.js'
import { template as popupTemplate } from './popup.template.js'
import { BlocksInput } from '../input/index.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksTime } from '../time/index.js'
import { Component } from '../component/Component.js'

// TODO, placeholder

export interface BlocksTimePicker extends Component {
  _ref: {
    $popup: BlocksPopup
    $time: BlocksTime
  }
}

@defineClass({
  customElement: 'bl-time-picker',
  styles: [style],
})
export class BlocksTimePicker extends Component {
  static override get observedAttributes() {
    return [...BlocksTime.observedAttributes, ...BlocksInput.observedAttributes]
  }

  @attr('intRange', { min: 0, max: 23 }) accessor hour!: number | null

  @attr('intRange', { min: 0, max: 59 }) accessor minute!: number | null

  @attr('intRange', { min: 0, max: 59 }) accessor second!: number | null

  @shadowRef('#result') accessor $input!: BlocksInput

  #clearup?: () => void

  _prevValue: {
    hour: number | null
    minute: number | null
    second: number | null
  } | null = {
    hour: null,
    minute: null,
    second: null,
  }

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!

    // input 部分
    shadowRoot.appendChild(template())

    const { $input } = this

    // 面板部分
    const $popup = popupTemplate()
    const $time = $popup.querySelector('bl-time')!

    this._ref = {
      $popup,
      $time,
    }

    $popup.anchorElement = () => $input

    const $confirm = $popup.querySelector('bl-button')!

    const onFocus = () => {
      $time.scrollToActive()
      $popup.open = true
    }
    $input.onfocus = $input.onclick = onFocus

    const onClear = () => {
      $time.clear()
      this._prevValue = {
        hour: null,
        minute: null,
        second: null,
      }
    }
    $input.addEventListener('click-clear', onClear)

    const onTimeChange = () => this.render()
    $time.addEventListener('change', onTimeChange)

    const onToggleOpen = () => boolSetter('popup-open')(this, $popup.open)
    $popup.addEventListener('open-changed', onToggleOpen)

    const onOpened = () => {
      this._prevValue = {
        hour: $time.hour,
        minute: $time.minute,
        second: $time.second,
      }
    }
    $popup.addEventListener('opened', onOpened)

    const onClosed = () => {
      if (this._prevValue) {
        $time.hour = this._prevValue.hour
        $time.minute = this._prevValue.minute
        $time.second = this._prevValue.second
        this._prevValue = null
      }
    }
    $popup.addEventListener('closed', onClosed)

    const onConfirm = this._confirm.bind(this)
    $confirm!.onclick = onConfirm

    this.onConnected(this.render)

    this.#setupPopup()

    this.onAttributeChangedDeps(BlocksInput.observedAttributes, (attrName, oldValue, newValue) => {
      this.$input.setAttribute(attrName, newValue as string)
    })

    this.onAttributeChangedDeps(BlocksTime.observedAttributes, (attrName, oldValue, newValue) => {
      this._ref.$time.setAttribute(attrName, newValue as string)
    })

    this.onAttributeChanged(this.render)
  }

  #setupPopup() {
    const _initClickOutside = () => {
      if (!this.#clearup) {
        this.#clearup = onClickOutside([this, this._ref.$popup], () => {
          if (this._ref.$popup.open) this._ref.$popup.open = false
        })
      }
    }

    const _destroyClickOutside = () => {
      if (this.#clearup) {
        this.#clearup()
        this.#clearup = undefined
      }
    }

    const onOpened = () => {
      _initClickOutside()
    }
    const onClosed = () => {
      _destroyClickOutside()
    }

    this.onConnected(() => {
      document.body.appendChild(this._ref.$popup)
      this._ref.$popup.addEventListener('opened', onOpened)
      this._ref.$popup.addEventListener('closed', onClosed)
    })

    this.onDisconnected(() => {
      document.body.removeChild(this._ref.$popup)
      _destroyClickOutside()
      this._ref.$popup.removeEventListener('opened', onOpened)
      this._ref.$popup.removeEventListener('closed', onClosed)
    })
  }

  override render() {
    super.render()
    const { $time } = this._ref
    if ([$time.hour, $time.minute, $time.second].some(v => Object.is(v, NaN) || v == null)) {
      this.$input.value = ''
      return
    }
    const hour = padLeft('0', 2, String($time.hour))
    const minute = padLeft('0', 2, String($time.minute))
    const second = padLeft('0', 2, String($time.second))
    this.$input.value = `${hour}:${minute}:${second}`
  }

  _confirm() {
    const { $popup, $time } = this._ref
    this._prevValue = null
    dispatchEvent(this, 'change', {
      detail: {
        hour: $time.hour,
        minute: $time.minute,
        second: $time.second,
      },
    })
    $popup.open = false
  }
}
