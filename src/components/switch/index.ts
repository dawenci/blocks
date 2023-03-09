import type { EnumAttrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import { style } from './style.js'
import { ComponentEventListener, ComponentEventMap } from '../Component.js'
import { Control } from '../base-control/index.js'
import { dispatchEvent } from '../../common/event.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'

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

  @attr('boolean') accessor checked!: boolean

  @attrs.size accessor size!: EnumAttrs['size']

  constructor() {
    super()

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
