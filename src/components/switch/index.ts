import { ComponentEventListener, ComponentEventMap } from '../Component.js'
import { dispatchEvent } from '../../common/event.js'
import {
  checkedGetter,
  checkedSetter,
  sizeGetter,
  sizeSetter,
} from '../../common/propertyAccessor.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'
import { switchStyleTemplate } from './template.js'
import { Control } from '../base-control/index.js'

export interface SwitchEventMap extends ComponentEventMap {
  change: CustomEvent<{ checked: boolean }>
}

export class BlocksSwitch extends Control {
  static get role() {
    return 'switch'
  }

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

  get checked() {
    return checkedGetter(this)
  }

  set checked(value) {
    checkedSetter(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
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

  override addEventListener<K extends keyof SwitchEventMap>(
    type: K,
    listener: ComponentEventListener<SwitchEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener, options)
  }

  override removeEventListener<K extends keyof SwitchEventMap>(
    type: K,
    listener: ComponentEventListener<SwitchEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void {
    super.removeEventListener(type, listener, options)
  }

  static override get observedAttributes() {
    return ['checked', 'disabled', 'size']
  }
}

if (!customElements.get('bl-switch')) {
  customElements.define('bl-switch', BlocksSwitch)
}
