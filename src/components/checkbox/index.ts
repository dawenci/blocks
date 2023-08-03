import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlControl } from '../base-control/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'
import { SetupEmpty } from '../setup-empty/index.js'
import { AriaFeature } from '../radio/AriaFeature.js'

export interface BlCheckboxEventMap extends BlComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
  'bl:checkbox:change': CustomEvent<{ checked: boolean }>
}

export interface BlCheckbox extends BlControl {
  addEventListener<K extends keyof BlCheckboxEventMap>(
    type: K,
    listener: BlComponentEventListener<BlCheckboxEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlCheckboxEventMap>(
    type: K,
    listener: BlComponentEventListener<BlCheckboxEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-checkbox',
  styles: [style],
})
export class BlCheckbox extends BlControl {
  static override get role() {
    return 'checkbox'
  }

  @attr('string') accessor name!: string | null
  @attr('boolean') accessor checked!: boolean
  @attr('boolean') accessor indeterminate!: boolean

  @shadowRef('[part="layout"]') accessor $layout!: HTMLDivElement
  @shadowRef('[part="checkbox"]') accessor $checkbox!: HTMLSpanElement
  @shadowRef('[part="label"]') accessor $label!: HTMLLabelElement
  @shadowRef('[part="slot"]') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this._tabIndexFeature.withTabIndex(0)
    this.#setupCheck()
    this.#setupIndeterminate()
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

  #setupIndeterminate() {
    const render = () => {
      if (this.indeterminate) {
        this.$checkbox.setAttribute('indeterminate', '')
      } else {
        this.$checkbox.removeAttribute('indeterminate')
      }
    }
    this.hook.onRender(render)
    this.hook.onConnected(render)
    this.hook.onAttributeChangedDep('indeterminate', () => {
      if (this.indeterminate) this.checked = false
      render()
    })
    this.hook.onAttributeChangedDep('checked', () => {
      if (this.checked) this.indeterminate = false
    })
  }

  #setupCheck() {
    const onClick = (e: MouseEvent) => {
      if (!e.defaultPrevented) {
        this.checked = !this.checked
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
      dispatchEvent(this, 'bl:checkbox:change', payload)
      dispatchEvent(this, 'change', payload)
    })
  }
}
