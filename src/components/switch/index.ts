import { attr, attrs } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'
import { BlControl } from '../base-control/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'

export interface SwitchEventMap extends BlComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
}

export interface BlSwitch extends BlControl {
  addEventListener<K extends keyof SwitchEventMap>(
    type: K,
    listener: BlComponentEventListener<SwitchEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof SwitchEventMap>(
    type: K,
    listener: BlComponentEventListener<SwitchEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-switch',
  styles: [style],
})
export class BlSwitch extends BlControl {
  static override get role() {
    return 'switch'
  }

  @attr('boolean') accessor checked!: boolean

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTabIndex(0)

    this.#setupEvents()

    this.hook.onAttributeChangedDep('checked', () => {
      dispatchEvent(this, 'change', { detail: { value: this.checked } })
    })
  }

  _controlFeature = SetupControlEvent.setup({ component: this })

  #setupEvents() {
    const onClick = () => {
      this.checked = !this.checked
    }
    this.hook.onConnected(() => {
      this.addEventListener('click', onClick)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('click', onClick)
    })
  }
}
