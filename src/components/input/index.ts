import '../popup/index.js'
import '../date/index.js'
import {
  disabledSetter,
  sizeGetter,
  sizeSetter,
} from '../../common/propertyAccessor.js'
import { dispatchEvent } from '../../common/event.js'
import {
  boolGetter,
  boolSetter,
  strGetter,
  strSetter,
} from '../../common/property.js'
import { styleTemplate, inputTemplate } from './template.js'
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

export class BlocksInput extends ClearableControlBox {
  static get role() {
    return 'input'
  }

  static override get observedAttributes() {
    return INPUT_ATTRS.concat(super.observedAttributes).concat([
      'size',
      'autofocus',
    ])
  }

  constructor() {
    super()

    this._appendStyle(styleTemplate())
    const $input = this._appendContent((this._ref.$input = inputTemplate()))

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

  get value() {
    return strGetter('value')(this)
  }

  set value(value) {
    strSetter('value')(this, value)
  }

  get type() {
    return strGetter('type')(this)
  }

  set type(value) {
    strSetter('type')(this, value)
  }

  get step() {
    return strGetter('step')(this)
  }

  set step(value) {
    strSetter('step')(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get readonly() {
    return boolGetter('readonly')(this)
  }

  set readonly(value) {
    boolSetter('readonly')(this, value)
  }

  get placeholder() {
    return strGetter('placeholder')(this)
  }

  set placeholder(value) {
    strSetter('placeholder')(this, value)
  }

  get name() {
    return strGetter('name')(this)
  }

  set name(value) {
    strSetter('name')(this, value)
  }

  get min() {
    return strGetter('min')(this)
  }

  set min(value) {
    strSetter('min')(this, value)
  }

  get max() {
    return strGetter('max')(this)
  }

  set max(value) {
    strSetter('max')(this, value)
  }

  get minlength() {
    return strGetter('minlength')(this)
  }

  set minlength(value) {
    strSetter('minlength')(this, value)
  }

  get maxlength() {
    return strGetter('maxlength')(this)
  }

  set maxlength(value) {
    strSetter('maxlength')(this, value)
  }

  override get autofocus() {
    return boolGetter('autofocus')(this)
  }

  override set autofocus(value) {
    boolSetter('autofocus')(this, value)
  }

  get autocomplete() {
    return boolGetter('autocomplete')(this)
  }

  set autocomplete(value) {
    boolSetter('autocomplete')(this, value)
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

if (!customElements.get('bl-input')) {
  customElements.define('bl-input', BlocksInput)
}
