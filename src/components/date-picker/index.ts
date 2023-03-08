import '../popup/index.js'
import '../button/index.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksInput } from '../input/index.js'
import { BlocksDate } from '../date/index.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { dispatchEvent } from '../../common/event.js'
import { boolSetter } from '../../common/property.js'
import {
  Component,
  ComponentEventListener,
  ComponentEventMap,
} from '../Component.js'
import { inputTemplate, popupTemplate } from './template.js'
import { style } from './style.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'

interface DatePickerEventMap extends ComponentEventMap {
  opened: CustomEvent
  closed: CustomEvent
  change: CustomEvent<{ value: any }>
}

export interface BlocksDatePicker extends Component {
  _ref: {
    $popup: BlocksPopup
    $date: BlocksDate
    $input: BlocksInput
  }

  addEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: ComponentEventListener<DatePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: ComponentEventListener<DatePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-date-picker',
  styles: [style],
})
export class BlocksDatePicker extends Component {
  static override get observedAttributes() {
    return BlocksDate.observedAttributes.concat(BlocksInput.observedAttributes)
  }

  #prevValue: any
  #clearClickOutside?: () => void

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!

    // input 部分
    const $input = shadowRoot.appendChild(inputTemplate())

    // popup date 部分
    const $popup = popupTemplate()
    const $date = $popup.querySelector('bl-date')!
    $popup.anchor = () => $input

    $input.onfocus = $input.onclick = () => {
      $popup.open = true
    }

    $date.addEventListener('select', () => {
      switch ($date.mode) {
        case 'single': {
          this.#prevValue = null
          this.render()
          $popup.open = false
          break
        }
        case 'range': {
          this.#prevValue = null
          this.render()
          $popup.open = false
          break
        }
        case 'multiple': {
          this.render()
          break
        }
      }
    })

    $date.addEventListener('change', () => {
      if ($date.mode !== 'multiple') {
        dispatchEvent(this, 'change', { detail: { value: this.value } })
      }
    })

    $popup.querySelector('bl-button')!.onclick = this._confirm.bind(this)

    $popup.addEventListener('open-changed', () => {
      boolSetter('popup-open')(this, $popup.open)
    })

    $popup.addEventListener('opened', () => {
      if ($date.mode !== null) {
        this.#prevValue = $date.value
      }

      ;($popup.querySelector('#action') as HTMLElement).style.display =
        $date.mode === 'multiple' ? 'block' : 'none'
      this.#initClickOutside()
      dispatchEvent(this, 'opened')
    })

    $popup.addEventListener('closed', () => {
      if ($date.mode !== null && this.#prevValue) {
        $date.value = this.#prevValue
        this.#prevValue = null
      }

      this.#destroyClickOutside()
      dispatchEvent(this, 'closed')
    })

    $input.addEventListener('click-clear', () => {
      $date.clearValue()
      this.#prevValue = $date.value
      this.render()
    })

    this._ref = {
      $popup,
      $date,
      $input,
    }
  }

  _confirm() {
    this.#prevValue = null
    this.value = this._ref.$date.getValues()
    dispatchEvent(this, 'change', { detail: { value: this.value } })
    this.render()
    this._ref.$popup.open = false
  }

  override render() {
    if (this._ref.$date.mode === 'range') {
      this._ref.$input.value = ((this.value as [Date, Date]) ?? [])
        .map(
          (date: Date) =>
            `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        )
        .join(' ~ ')
    } else if (this._ref.$date.mode === 'multiple') {
      this._ref.$input.value = ((this.value as Date[]) ?? [])
        .map(
          (date: Date) =>
            `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        )
        .join(', ')
    } else {
      const date = this.value as Date
      this._ref.$input.value = date
        ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        : ''
    }
  }

  // TODO，全部改成 attribute
  get value() {
    return this._ref.$date.value
  }

  set value(value) {
    this._ref.$date.value = value
  }

  get disabledDate() {
    return this._ref.$date.disabledDate
  }

  set disabledDate(value) {
    this._ref.$date.disabledDate = value
  }

  getDateProp(prop: string) {
    return (this._ref.$date as any)[prop]
  }

  setDateProp(prop: string, value: any) {
    ;(this._ref.$date as any)[prop] = value
  }

  getInputProp(prop: string) {
    return (this._ref.$input as any)[prop]
  }

  setInputProp(prop: string, value: any) {
    ;(this._ref.$input as any)[prop] = value
  }

  override connectedCallback() {
    super.connectedCallback()
    document.body.appendChild(this._ref.$popup)

    this.render()
    ;(this._ref.$popup.querySelector('#action') as HTMLElement).style.display =
      this._ref.$date.mode === 'multiple' ? 'block' : 'none'

    if (this._ref.$input.placeholder == null) {
      this._ref.$input.placeholder = '请选择日期'
    }
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
    if (BlocksInput.observedAttributes.includes(attrName)) {
      this._ref.$input.setAttribute(attrName, newValue)
    }
    if (BlocksDate.observedAttributes.includes(attrName)) {
      this._ref.$date.setAttribute(attrName, newValue)
    }
    this.render()
  }

  #initClickOutside() {
    if (!this.#clearClickOutside) {
      this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
        if (this._ref.$popup.open) {
          this._ref.$date.clearUncompleteRange()
          this._ref.$popup.open = false
        }
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
