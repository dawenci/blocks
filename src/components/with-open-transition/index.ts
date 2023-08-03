import type { BlComponentEventMap } from '../component/Component.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'
import { style } from './style.js'
import { BlComponent } from '../component/Component.js'

export interface WithOpenTransitionEventMap extends BlComponentEventMap {
  opened: CustomEvent
  closed: CustomEvent
  'open-changed': CustomEvent<{ value: boolean }>
}

@defineClass({
  styles: [style],
})
export class WithOpenTransition extends BlComponent {
  @attr('boolean') accessor open!: boolean

  @attr('string', { defaults: 'zoom' }) accessor openTransitionName!: string

  setupMixin() {
    const _onOpenAttributeChange = () => {
      if (this.open) {
        doTransitionEnter(this, this.openTransitionName, () => {
          dispatchEvent(this, 'opened')
        })
      } else {
        doTransitionLeave(this, this.openTransitionName, () => {
          dispatchEvent(this, 'closed')
        })
      }
      dispatchEvent(this, 'open-changed', {
        detail: {
          value: this.open,
        },
      })
    }

    this.hook.onConnected(() => {
      if (this.open) _onOpenAttributeChange()
    })
    this.hook.onAttributeChangedDep('open', _onOpenAttributeChange)
  }
}
