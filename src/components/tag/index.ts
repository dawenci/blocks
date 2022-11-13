import { dispatchEvent } from '../../common/event.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import {
  closeableGetter,
  closeableSetter,
  sizeGetter,
  sizeSetter,
} from '../../common/propertyAccessor.js'
import { Component } from '../Component.js'
import { getElementTarget } from '../../common/getElementTarget.js'
import { template } from './template.js'

type DomRef = {
  $layout: HTMLElement
}

export class BlocksTag extends Component {
  ref: DomRef

  static override get observedAttributes() {
    return ['type', 'size', 'closeable', 'round']
  }

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.appendChild(template().content.cloneNode(true))

    const $layout = shadowRoot.getElementById('layout')!

    shadowRoot.addEventListener('click', e => {
      if (getElementTarget(e)?.id === 'close') {
        dispatchEvent(this, 'close')
      }
    })

    this.ref = {
      $layout,
    }
  }

  get closeable() {
    return closeableGetter(this)
  }

  set closeable(value) {
    closeableSetter(this, value)
    this.render()
  }

  get outline() {
    return boolGetter('outline')(this)
  }

  set outline(value) {
    boolSetter('outline')(this, value)
    this.render()
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  override render() {
    if (this.closeable) {
      if (!this.shadowRoot!.getElementById('close')) {
        const button = this.ref.$layout.appendChild(
          document.createElement('button')
        )
        button.id = 'close'
      }
    } else {
      const button = this.shadowRoot!.getElementById('close')
      if (button) {
        button.parentElement!.removeChild(button)
      }
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.render()
  }
}

if (!customElements.get('bl-tag')) {
  customElements.define('bl-tag', BlocksTag)
}
