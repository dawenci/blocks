import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { Control } from '../base-control/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'
import { SetupEmpty } from '../setup-empty/index.js'

interface CheckboxEventMap extends ComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
  'bl:checkbox:change': CustomEvent<{ checked: boolean }>
}

export interface BlocksCheckbox extends Control {
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

@defineClass({
  customElement: 'bl-checkbox',
  styles: [style],
})
export class BlocksCheckbox extends Control {
  static get role() {
    return 'checkbox'
  }

  static override get disableEventTypes() {
    return ['click', 'keydown', 'touchstart']
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

  #setupIndeterminate() {
    const render = () => {
      if (this.indeterminate) {
        this.$checkbox.setAttribute('indeterminate', '')
      } else {
        this.$checkbox.removeAttribute('indeterminate')
      }
    }
    this.onRender(render)
    this.onConnected(render)
    this.onAttributeChangedDep('indeterminate', () => {
      if (this.indeterminate) this.checked = false
      render()
    })
    this.onAttributeChangedDep('checked', () => {
      if (this.checked) this.indeterminate = false
    })
  }

  #setupCheck() {
    const onClick = (e: MouseEvent) => {
      if (!e.defaultPrevented) {
        this.checked = !this.checked
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
      dispatchEvent(this, 'bl:checkbox:change', payload)
      dispatchEvent(this, 'change', payload)
    })
  }
}
