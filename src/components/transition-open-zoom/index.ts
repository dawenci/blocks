import { defineClass } from '../../decorators/defineClass.js'

import { attr } from '../../decorators/attr.js'
import {
  WithOpenTransition,
  WithOpenTransitionEventMap,
} from '../with-open-transition/index.js'
import { Component, ComponentEventListener } from '../Component.js'

export interface BlocksTransitionOpenZoom
  extends Component,
    WithOpenTransition {
  onOpen?: () => void
  onClose?: () => void

  addEventListener<K extends keyof WithOpenTransitionEventMap>(
    type: K,
    listener: ComponentEventListener<WithOpenTransitionEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof WithOpenTransitionEventMap>(
    type: K,
    listener: ComponentEventListener<WithOpenTransitionEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  mixins: [WithOpenTransition],
})
export class BlocksTransitionOpenZoom extends Component {
  @attr('boolean') accessor open!: boolean

  override connectedCallback() {
    super.connectedCallback()

    if (this.open) {
      this._onOpenAttributeChange()
    }
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (attrName == 'open') {
      this._onOpenAttributeChange()
    }
  }
}
