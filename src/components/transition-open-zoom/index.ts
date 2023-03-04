import { dispatchEvent } from '../../common/event.js'
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { attr } from '../../decorators/attr.js'

export class BlocksTransitionOpenZoom extends Component {
  onOpen?: () => void
  onClose?: () => void

  static override get observedAttributes() {
    return ['open']
  }

  @attr('boolean') accessor open!: boolean

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.appendChild(template().content.cloneNode(true))
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName == 'open') {
      if (this.open) {
        doTransitionEnter(this, 'zoom', () => {
          if (this.onOpen) {
            this.onOpen()
          }
          dispatchEvent(this, 'opened')
        })
      } else {
        doTransitionLeave(this, 'zoom', () => {
          if (this.onClose) {
            this.onClose()
          }
          dispatchEvent(this, 'closed')
        })
      }
      dispatchEvent(this, 'open-changed')
    }
  }
}
