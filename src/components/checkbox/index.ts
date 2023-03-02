import { dispatchEvent } from '../../common/event.js'
import { checkedGetter, checkedSetter } from '../../common/propertyAccessor.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'
import { ComponentEventListener, ComponentEventMap } from '../Component.js'
import { Control } from '../base-control/index.js'
import { checkboxTemplate, labelTemplate, styleTemplate } from './template.js'
import {
  boolGetter,
  boolSetter,
  strGetter,
  strSetter,
} from '../../common/property.js'

interface CheckboxEventMap extends ComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
  'bl:checkbox:change': CustomEvent<{ checked: boolean }>
}

export interface BlocksCheckbox extends Control {
  _ref: Control['_ref'] & {
    $checkbox: HTMLSpanElement
    $label: HTMLLabelElement
    $slot: HTMLSlotElement
  }

  addEventListener<K extends keyof CheckboxEventMap>(
    type: K,
    listener: ComponentEventListener<CheckboxEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof CheckboxEventMap>(
    type: K,
    listener: ComponentEventListener<CheckboxEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

export class BlocksCheckbox extends Control {
  static override get observedAttributes() {
    return super.observedAttributes.concat(['name', 'checked', 'indeterminate'])
  }

  static get role() {
    return 'checkbox'
  }

  constructor() {
    super()

    this._appendStyle(styleTemplate())
    const $checkbox = this._ref.$layout.appendChild(checkboxTemplate())
    const $label = this._ref.$layout.appendChild(labelTemplate())
    const $slot = $label.querySelector('slot')!
    this._ref.$checkbox = $checkbox
    this._ref.$label = $label
    this._ref.$slot = $slot

    const toggleEmptyClass = () => {
      $label.classList.toggle('empty', !$slot.assignedNodes().length)
    }
    toggleEmptyClass()
    $slot.addEventListener('slotchange', toggleEmptyClass)

    captureEventWhenEnable(this, 'click', () => {
      this.indeterminate = false
      this.checked = !this.checked
    })

    captureEventWhenEnable(this, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.checked = !this.checked
        // 阻止按空格键触发滚动
        e.preventDefault()
      }
    })
  }

  get name() {
    return strGetter('name')(this)
  }

  set name(value) {
    strSetter('name')(this, value)
  }

  get checked() {
    return checkedGetter(this)
  }

  set checked(value) {
    checkedSetter(this, value)
  }

  get indeterminate() {
    return boolGetter('indeterminate')(this)
  }

  set indeterminate(v) {
    boolSetter('indeterminate')(this, v)
  }

  _renderIndeterminate() {
    const checkbox = this.shadowRoot!.querySelector('#checkbox')!
    if (this.indeterminate) {
      checkbox.setAttribute('indeterminate', '')
    } else {
      checkbox.removeAttribute('indeterminate')
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.internalTabIndex = '0'
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (attrName === 'indeterminate') {
      if (this.indeterminate) {
        this.checked = false
      }
      this._renderIndeterminate()
    }

    if (attrName === 'checked') {
      if (this.checked) {
        this.indeterminate = false
      }
      const payload = { detail: { checked: this.checked } }
      dispatchEvent(this, 'bl:checkbox:change', payload)
      dispatchEvent(this, 'change', payload)
    }
  }
}

if (!customElements.get('bl-checkbox')) {
  customElements.define('bl-checkbox', BlocksCheckbox)
}
