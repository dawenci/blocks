import type { EnumAttrs } from '../../decorators/attr.js'
import { attr, attrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { ComponentEventListener, ComponentEventMap } from '../component/Component.js'
import { Control } from '../base-control/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'

export interface SwitchEventMap extends ComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
}

export interface BlocksSwitch extends Control {
  addEventListener<K extends keyof SwitchEventMap>(
    type: K,
    listener: ComponentEventListener<SwitchEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof SwitchEventMap>(
    type: K,
    listener: ComponentEventListener<SwitchEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-switch',
  styles: [style],
})
export class BlocksSwitch extends Control {
  static get role() {
    return 'switch'
  }

  static override get disableEventTypes(): readonly string[] {
    return ['click', 'keydown']
  }

  @attr('boolean') accessor checked!: boolean

  @attrs.size accessor size!: EnumAttrs['size']

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTabIndex(0)

    this.#setupEvents()

    this.onAttributeChangedDep('checked', () => {
      dispatchEvent(this, 'change', { detail: { value: this.checked } })
    })
  }

  _controlFeature = SetupControlEvent.setup({ component: this })

  #setupEvents() {
    const onClick = () => {
      this.checked = !this.checked
    }
    this.onConnected(() => {
      this.addEventListener('click', onClick)
    })
    this.onDisconnected(() => {
      this.removeEventListener('click', onClick)
    })
  }
}
