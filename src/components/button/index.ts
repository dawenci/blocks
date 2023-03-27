import type { ComponentEventListener } from '../component/Component.js'
import type { ControlBoxEventMap } from '../base-control-box/index.js'
import type { EnumAttr, EnumAttrs } from '../../decorators/attr.js'
import { attr, attrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { ControlBox } from '../base-control-box/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'
import { SetupEmpty } from '../setup-empty/index.js'

const types = ['primary', 'danger', 'warning', 'success', 'link'] as const

export interface BlocksButton extends ControlBox {
  addEventListener<K extends keyof ControlBoxEventMap>(
    type: K,
    listener: ComponentEventListener<ControlBoxEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ControlBoxEventMap>(
    type: K,
    listener: ComponentEventListener<ControlBoxEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-button',
  styles: [style],
})
export class BlocksButton extends ControlBox {
  static get role() {
    return 'button'
  }

  static override get disableEventTypes() {
    return ['click', 'keydown', 'touchstart']
  }

  @attr('boolean') accessor block!: boolean

  @attr('boolean') accessor outline!: boolean

  @attr('enum', { enumValues: types }) accessor type!: EnumAttr<typeof types> | null

  @attrs.size accessor size!: EnumAttrs['size'] | null

  @shadowRef('[part="content"]') accessor $content!: HTMLSpanElement

  @shadowRef('[part="slot"]') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendContent(template())
    this._tabIndexFeature.withTabIndex(0)

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
    this.onConnected(() => {
      _observer = new MutationObserver(update)
      _observer.observe(this, { childList: true })
      update()
    })
    this.onDisconnected(() => {
      if (_observer) {
        _observer.disconnect()
        _observer = undefined
      }
    })
  }
}
