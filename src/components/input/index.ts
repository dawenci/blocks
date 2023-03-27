import type { EnumAttrs } from '../../decorators/attr.js'
import { attr, attrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { disabledSetter } from '../../common/propertyAccessor.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { ClearableControlBox, ClearableControlBoxEventMap } from '../base-clearable-control-box/index.js'
import { ComponentEventListener } from '../component/Component.js'
import { ISelected, ISelectResultEventMap, ISelectResultComponent } from '../../common/connectSelectable.js'

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
] as const

interface BlocksInputEventMap extends ClearableControlBoxEventMap, ISelectResultEventMap {
  change: CustomEvent<{ value: string }>
}

export interface BlocksInput extends ClearableControlBox, ISelectResultComponent {
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
export class BlocksInput extends ClearableControlBox implements ISelectResultComponent {
  static get role() {
    return 'input'
  }

  static override get disableEventTypes() {
    return ['click', 'keydown', 'touchstart']
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

  @shadowRef('[part="input"]') accessor $input!: HTMLInputElement

  constructor() {
    super()

    this.appendContent(template())
    this._tabIndexFeature.withTabIndex(0).withTarget(() => [this.$input])

    this.#setupDisableFeature()
    this.#setupValueModify()
  }

  #setupDisableFeature() {
    this._disabledFeature.withPostUpdate(() => {
      disabledSetter(this.$input, this.disabled)
    })
  }

  // 实现 ISelectResultComponent 事件
  #notifyClear() {
    dispatchEvent(this, 'select-result:clear')
  }

  // 实现 ISelectResultComponent 事件
  #notifyDeselect() {
    dispatchEvent(this, 'select-result:deselect')
  }

  // 实现 ISelectResultComponent 事件
  #notifySearch(searchString: string) {
    dispatchEvent(this, 'select-result:search', { detail: { searchString } })
  }

  #setupValueModify() {
    this._emptyFeature.withPredicate(() => {
      return !this.value
    })

    const onChange = () => {
      this.value = this.$input.value
    }
    const onClear = () => {
      this.value = ''
      this.#notifyClear()
    }
    this.onConnected(() => {
      this.$input.oninput = this.$input.onchange = onChange
      this.addEventListener('click-clear', onClear)
    })
    this.onDisconnected(() => {
      this.$input.oninput = this.$input.onchange = null
      this.removeEventListener('click-clear', onClear)
    })

    this.onAttributeChangedDeps(INPUT_ATTRS, (name, _: any, val: any): void => {
      if (name === 'value') {
        if (this.$input.value !== val) {
          this.$input.value = val
        }
      } else {
        this.$input.setAttribute(name, val)
      }
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    })

    this.onAttributeChangedDep('value', () => {
      this._emptyFeature.update()
    })
  }

  // 实现 ISelectResultComponent 方法
  acceptSelected(value: ISelected[]) {
    const label = value.map(item => item.label).join(', ')
    this.value = label
  }

  clearSearch() {
    this.#notifySearch('')
  }

  override focus() {
    this.$input.focus()
  }
}
