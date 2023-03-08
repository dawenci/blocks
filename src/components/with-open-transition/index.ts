import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { style } from './style.js'
import { dispatchEvent } from '../../common/event.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'
import { Component, ComponentEventMap } from '../Component.js'

export interface WithOpenTransitionEventMap extends ComponentEventMap {
  opened: CustomEvent
  closed: CustomEvent
  'open-changed': CustomEvent<{ value: boolean }>
}

@defineClass({
  styles: [style],
})
export class WithOpenTransition extends Component {
  onOpen?: () => void
  onClose?: () => void

  @attr('boolean') accessor open!: boolean

  @attr('string', { defaults: 'zoom' }) accessor openTransitionName!: string

  _onOpenAttributeChange() {
    if (this.open) {
      doTransitionEnter(this, this.openTransitionName, () => {
        if (this.onOpen) {
          this.onOpen()
        }
        dispatchEvent(this, 'opened')
      })
    } else {
      doTransitionLeave(this, this.openTransitionName, () => {
        if (this.onClose) {
          this.onClose()
        }
        dispatchEvent(this, 'closed')
      })
    }
    dispatchEvent(this, 'open-changed', {
      detail: {
        value: this.open,
      },
    })
  }
}
