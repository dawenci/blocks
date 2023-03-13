import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'
import { ComponentEventListener, ComponentEventMap } from '../Component.js'
import { labelTemplate, radioTemplate } from './template.js'
import { style } from './style.js'
import { dispatchEvent } from '../../common/event.js'
import { Control } from '../base-control/index.js'
import { domRef } from '../../decorators/domRef.js'

interface RadioEventMap extends ComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
}

export interface BlocksRadio extends Control {
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

@defineClass({
  customElement: 'bl-radio',
  styles: [style],
})
export class BlocksRadio extends Control {
  static get role() {
    return 'radio'
  }

  @attr('string') accessor name!: string

  @attr('boolean') accessor checked!: boolean

  @domRef('#radio') accessor $radio!: HTMLElement

  @domRef('#label') accessor $label!: HTMLLabelElement

  @domRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.$layout.appendChild(radioTemplate())
    const $label = this.$layout.appendChild(labelTemplate())
    const $slot = $label.querySelector('slot')!

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

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'checked') {
      dispatchEvent(this, 'change', { detail: { checked: this.checked } })
    }
  }
}
