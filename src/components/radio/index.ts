import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'
import { ComponentEventListener, ComponentEventMap } from '../Component.js'
import { labelTemplate, radioTemplate, styleTemplate } from './template.js'
import { dispatchEvent } from '../../common/event.js'
import { Control } from '../base-control/index.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

interface RadioEventMap extends ComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
}

export interface BlocksRadio extends Control {
  _ref: Control['_ref'] & {
    $radio: HTMLElement
    $label: HTMLLabelElement
    $slot: HTMLSlotElement
  }

  addEventListener<K extends keyof RadioEventMap>(
    type: K,
    listener: ComponentEventListener<RadioEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof RadioEventMap>(
    type: K,
    listener: ComponentEventListener<RadioEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@customElement('bl-radio')
export class BlocksRadio extends Control {
  static get role() {
    return 'radio'
  }

  static override get observedAttributes() {
    return super.observedAttributes.concat(['name', 'checked'])
  }

  @attr('string') accessor name!: string

  @attr('boolean') accessor checked!: boolean

  constructor() {
    super()

    this._appendStyle(styleTemplate())
    const $radio = this._ref.$layout.appendChild(radioTemplate())
    const $label = this._ref.$layout.appendChild(labelTemplate())
    const $slot = $label.querySelector('slot')!

    Object.assign(this, { $radio, $label, $slot })

    const toggleEmptyClass = () => {
      $label.classList.toggle('empty', !$slot.assignedNodes().length)
    }
    toggleEmptyClass()
    $slot.addEventListener('slotchange', toggleEmptyClass)

    const check = () => {
      if (!this.checked && this.name) {
        document.getElementsByName(this.name).forEach(el => {
          if (el !== this && el instanceof BlocksRadio) {
            el.checked = false
          }
        })
        this.checked = true
      }
    }

    captureEventWhenEnable(this, 'click', check)
    captureEventWhenEnable(this, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        check()
        e.preventDefault()
      }
    })
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
    if (attrName === 'checked') {
      dispatchEvent(this, 'change', { detail: { checked: this.checked } })
    }
  }
}
