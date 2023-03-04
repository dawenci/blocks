import { ComponentEventListener, ComponentEventMap } from '../Component.js'
import { dispatchEvent } from '../../common/event.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'
import { switchStyleTemplate } from './template.js'
import { Control } from '../base-control/index.js'
import { customElement } from '../../decorators/customElement.js'
import { attr, attrs } from '../../decorators/attr.js'
import type { EnumAttrs } from '../../decorators/attr.js'

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

@customElement('bl-switch')
export class BlocksSwitch extends Control {
  static override get observedAttributes() {
    return ['checked', 'disabled', 'size']
  }

  static get role() {
    return 'switch'
  }

  @attr('boolean') accessor checked!: boolean

  @attrs.size accessor size!: EnumAttrs['size']

  constructor() {
    super()

    this._appendStyle(switchStyleTemplate())

    captureEventWhenEnable(this, 'click', () => {
      this.checked = !this.checked
    })
    captureEventWhenEnable(this, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.checked = !this.checked
      }
    })
  }

  override connectedCallback() {
    super.connectedCallback()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'checked') {
      dispatchEvent(this, 'change', { detail: { value: this.checked } })
    }
  }
}
