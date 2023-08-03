import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { AriaFeature } from './AriaFeature.js'
import { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import { BlControl } from '../base-control/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'
import { SetupEmpty } from '../setup-empty/index.js'

interface RadioEventMap extends BlComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
}

export interface BlRadio extends BlControl {
  addEventListener<K extends keyof RadioEventMap>(
    type: K,
    listener: BlComponentEventListener<RadioEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof RadioEventMap>(
    type: K,
    listener: BlComponentEventListener<RadioEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-radio',
  styles: [style],
})
export class BlRadio extends BlControl {
  static override get role() {
    return 'radio'
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

  _ariaFeature = AriaFeature.make('aria', this)

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
      this.hook.onConnected(() => {
        this.$slot.addEventListener('slotchange', toggle)
      })
      this.hook.onDisconnected(() => {
        this.$slot.removeEventListener('slotchange', toggle)
      })
    },
  })

  #setupCheck() {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      if (!this.checked && this.name) {
        document.getElementsByName(this.name).forEach($el => {
          if ($el !== this && $el instanceof BlRadio) {
            $el.checked = false
          }
        })
        this.checked = true
      }
    }

    this.hook.onConnected(() => {
      this.addEventListener('click', onClick)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('click', onClick)
    })

    this.hook.onAttributeChangedDep('checked', () => {
      const payload = { detail: { checked: this.checked } }
      dispatchEvent(this, 'bl:radio:change', payload)
      dispatchEvent(this, 'change', payload)
    })
  }
}
