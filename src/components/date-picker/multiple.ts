import type { BaseDatePickerEventMap } from './base.js'
import type { BlComponentEventListener } from '../component/Component.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { BlDate } from '../date/index.js'
import { BlSelectResult } from '../select-result/index.js'
import { BlPopup } from '../popup/index.js'
import { BaseDatePicker } from './base.js'

export interface BlDatePickerEventMap extends BaseDatePickerEventMap {
  change: CustomEvent<{ value: Date[] }>
  closed: CustomEvent
  opened: CustomEvent
}

export interface BlDatePicker extends BaseDatePicker {
  addEventListener<K extends keyof BlDatePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDatePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlDatePickerEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDatePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-dates-picker',
})
export class BlDatesPicker extends BaseDatePicker {
  static override get observedAttributes() {
    return [...BlPopup.observedAttributes, ...BlDate.observedAttributes, ...BlSelectResult.observedAttributes]
  }

  constructor() {
    super()
  }

  override get mode(): 'multiple' {
    return 'multiple'
  }

  override get value() {
    return this._model.content
  }

  override set value(dates: Date[]) {
    this._model.content = dates
  }
}
