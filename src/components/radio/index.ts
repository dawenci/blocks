import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { ComponentEventListener, ComponentEventMap } from '../component/Component.js'
import { Control } from '../base-control/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'
import { SetupEmpty } from '../setup-empty/index.js'

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

  static override get disableEventTypes() {
    return ['click', 'keydown', 'touchstart']
  }

  @attr('string') accessor name!: string
  @attr('boolean') accessor checked!: boolean

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('[part="radio"]') accessor $radio!: HTMLElement
  @shadowRef('[part="label"]') accessor $label!: HTMLLabelElement
  @shadowRef('[part="slot"]') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTabIndex(0)

    this.#setupCheck()
  }

  _controlFeature = SetupControlEvent.setup({ component: this })

  _emptyFeature = SetupEmpty.setup({
    component: this,
    predicate: () => {
      const $nodes = this.$slot.assignedNodes()
      for (let i = 0; i < $nodes.length; ++i) {
        if ($nodes[i].nodeType === 1) return false
        if ($nodes[i].nodeType === 3 && $nodes[i].nodeValue?.trim()) return false
      }
      return true
    },
    target: () => this.$label,
    init: () => {
      const toggle = () => this._emptyFeature.update()
      this.onConnected(() => {
        this.$slot.addEventListener('slotchange', toggle)
      })
      this.onDisconnected(() => {
        this.$slot.removeEventListener('slotchange', toggle)
      })
    },
  })

  #setupCheck() {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      if (!this.checked && this.name) {
        document.getElementsByName(this.name).forEach(el => {
          if (el !== this && el instanceof BlocksRadio) {
            el.checked = false
          }
        })
        this.checked = true
      }
    }

    this.onConnected(() => {
      this.addEventListener('click', onClick)
    })
    this.onDisconnected(() => {
      this.removeEventListener('click', onClick)
    })

    this.onAttributeChangedDep('checked', () => {
      const payload = { detail: { checked: this.checked } }
      dispatchEvent(this, 'bl:radio:change', payload)
      dispatchEvent(this, 'change', payload)
    })
  }
}
