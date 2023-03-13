import '../popup/index.js'
import '../time/index.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { domRef } from '../../decorators/domRef.js'
import { BlocksInput } from '../input/index.js'
import { BlocksTime } from '../time/index.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { padLeft } from '../../common/utils.js'
import { boolSetter } from '../../common/property.js'
import { dispatchEvent } from '../../common/event.js'
import { Component } from '../Component.js'
import { style } from './style.js'
import { template } from './template.js'
import { template as popupTemplate } from './popup.template.js'
import { BlocksPopup } from '../popup/index.js'

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

  @domRef('#result') accessor $input!: BlocksInput

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

    $popup.anchor = () => $input

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
      this._initClickOutside()
    }
    $popup.addEventListener('opened', onOpened)

    const onClosed = () => {
      if (this._prevValue) {
        $time.hour = this._prevValue.hour
        $time.minute = this._prevValue.minute
        $time.second = this._prevValue.second
        this._prevValue = null
      }
      this._destroyClickOutside()
    }
    $popup.addEventListener('closed', onClosed)

    const onConfirm = this._confirm.bind(this)
    $confirm!.onclick = onConfirm
  }

  override connectedCallback() {
    super.connectedCallback()
    document.body.appendChild(this._ref.$popup)
    this.render()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.body.removeChild(this._ref.$popup)
    this._destroyClickOutside()
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (BlocksInput.observedAttributes.includes(attrName)) {
      this.$input.setAttribute(attrName, newValue)
    }
    if (BlocksTime.observedAttributes.includes(attrName as any)) {
      this._ref.$time.setAttribute(attrName, newValue)
    }
    this.render()
  }

  override render() {
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

  _initClickOutside() {
    if (!this.#clearup) {
      this.#clearup = onClickOutside([this, this._ref.$popup], () => {
        if (this._ref.$popup.open) this._ref.$popup.open = false
      })
    }
  }

  _destroyClickOutside() {
    if (this.#clearup) {
      this.#clearup()
      this.#clearup = undefined
    }
  }
}
