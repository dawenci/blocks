import '../popup/index.js'
import '../date/index.js'
import { disabledSetter } from '../../common/propertyAccessor.js'
import { dispatchEvent } from '../../common/event.js'
import {
  ClearableControlBox,
  ClearableControlBoxEventMap,
} from '../base-clearable-control-box/index.js'
import { ComponentEventListener } from '../Component.js'
import {
  ISelected,
  ISelectResultEventMap,
  ISelectResultComponent,
} from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import type { EnumAttrs } from '../../decorators/attr.js'
import { template } from './template.js'
import { style } from './style.js'

const INPUT_ATTRS = [
  'value',
  'type',
  'step',
  'readonly',
  'placeholder',
  'name',
  'multiple',
  'min',
  'max',
  'minlength',
  'maxlength',
  'autocomplete',
]

interface BlocksInputEventMap
  extends ClearableControlBoxEventMap,
    ISelectResultEventMap {
  change: CustomEvent<{ value: string }>
}

export interface BlocksInput
  extends ClearableControlBox,
    ISelectResultComponent {
  _ref: ClearableControlBox['_ref'] & {
    $input: HTMLInputElement
    $prefix?: HTMLElement
    $suffix?: HTMLElement
    $clear?: HTMLButtonElement
  }

  addEventListener<K extends keyof BlocksInputEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksInputEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlocksInputEventMap>(
    type: K,
    listener: ComponentEventListener<BlocksInputEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-input',
  styles: [style],
})
export class BlocksInput extends ClearableControlBox {
  static get role() {
    return 'input'
  }

  @attr('string') accessor value!: string | null

  @attr('string') accessor type!: string | null

  @attr('string') accessor step!: string | null

  @attr('boolean') accessor readonly!: boolean

  @attr('string') accessor placeholder!: string | null

  @attr('string') accessor name!: string | null

  @attr('string') accessor min!: string | null

  @attr('string') accessor max!: string | null

  @attr('string') accessor minlength!: string | null

  @attr('string') accessor maxlength!: string | null

  @attr('boolean') accessor autocomplete!: boolean

  @attr('boolean') override accessor autofocus!: boolean

  @attrs.size accessor size!: EnumAttrs['size']

  /* file/email */
  @attr('boolean') accessor multiple!: boolean

  constructor() {
    super()

    const $input = this._appendContent((this._ref.$input = template()))

    $input.oninput = $input.onchange = () => {
      // 实现 ISelectResultComponent 事件
      dispatchEvent(this, 'select-result:clear')
      dispatchEvent(this, 'select-result:search', {
        detail: { searchString: $input.value },
      })

      this.setValue($input.value)
    }
    this.addEventListener('click-clear', () => {
      this.clearValue()
      // 实现 ISelectResultComponent 事件
      dispatchEvent(this, 'select-result:clear')
      dispatchEvent(this, 'select-result:search', {
        detail: { searchString: '' },
      })
    })
  }

  // 实现 ISelectResultComponent 方法
  acceptSelected(value: ISelected[]) {
    const label = value.map(item => item.label).join(', ')
    if (label) {
      this.setValue(label)
    }
  }

  setValue(value: string) {
    this.value = value
    this._renderEmpty()
  }

  clearValue() {
    this._ref.$input.value = ''
  }

  override focus() {
    this._ref.$input.focus()
  }

  override _isEmpty() {
    return !this._ref.$input.value
  }

  override _renderDisabled() {
    super._renderDisabled()
    disabledSetter(this._ref.$input, this.disabled)
  }

  override connectedCallback() {
    super.connectedCallback()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (INPUT_ATTRS.includes(attrName)) {
      if (attrName === 'value') {
        if (this._ref.$input.value !== newValue) {
          this._ref.$input.value = newValue
        }
      } else {
        this._ref.$input.setAttribute(attrName, newValue)
      }
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    }
  }
}
