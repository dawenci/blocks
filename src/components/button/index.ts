import type { BlComponentEventListener } from '../component/Component.js'
import type { BlControlBoxEventMap } from '../base-control-box/index.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlControlBox } from '../base-control-box/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'
import { SetupEmpty } from '../setup-empty/index.js'

const types = ['primary', 'danger', 'warning', 'success', 'link'] as const

export interface BlButton extends BlControlBox {
  addEventListener<K extends keyof BlControlBoxEventMap>(
    type: K,
    listener: BlComponentEventListener<BlControlBoxEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlControlBoxEventMap>(
    type: K,
    listener: BlComponentEventListener<BlControlBoxEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-button',
  styles: [style],
})
export class BlButton extends BlControlBox {
  static override get role() {
    return 'button'
  }

  @attr('boolean') accessor block!: boolean

  @attr('boolean') accessor outline!: boolean

  @attr('enum', { enumValues: types }) accessor type!: OneOf<typeof types> | null

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']> | null

  @shadowRef('[part="content"]') accessor $content!: HTMLSpanElement

  @shadowRef('[part="slot"]') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendContent(template())
    this._tabIndexFeature.withTabIndex(0)
    this._disabledFeature.withPredicate(() => this.disabled || this.loading)

    this.#setupContent()
  }

  _controlFeature = SetupControlEvent.setup({ component: this })

  _emptyFeature = SetupEmpty.setup({
    component: this,
    predicate: () => !this.$slot.assignedNodes().filter($node => $node.nodeType === 1 || $node.nodeType === 3).length,
    target: () => this.$layout,
  })

  #setupContent() {
    let _observer: MutationObserver | undefined
    const updateClass = () => {
      this._emptyFeature.update()
    }
    const updateAria = () => {
      this.setAttribute('aria-label', this.textContent ?? '')
    }
    const update = () => {
      updateAria()
      updateClass()
    }
    this.hook.onConnected(() => {
      _observer = new MutationObserver(update)
      _observer.observe(this, { childList: true })
      update()
    })
    this.hook.onDisconnected(() => {
      if (_observer) {
        _observer.disconnect()
        _observer = undefined
      }
    })
  }
}
