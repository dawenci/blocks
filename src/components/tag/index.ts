import { dispatchEvent } from '../../common/event.js'
import { Component } from '../Component.js'
import { getElementTarget } from '../../common/getElementTarget.js'
import { template } from './template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import type { EnumAttrs } from '../../decorators/attr.js'

export interface BlocksTag extends Component {
  ref: {
    $layout: HTMLElement
  }
}

@defineClass({
  customElement: 'bl-tag',
})
export class BlocksTag extends Component {
  static override get observedAttributes() {
    return ['type', 'size', 'closeable', 'round', 'outline']
  }

  @attr('boolean') accessor closeable!: boolean

  @attr('boolean') accessor outline!: boolean

  @attrs.size accessor size!: EnumAttrs['size']

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!

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
