import type { EnumAttrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import { domRef } from '../../decorators/domRef.js'
import { dispatchEvent } from '../../common/event.js'
import { Component } from '../Component.js'
import { getElementTarget } from '../../common/getElementTarget.js'
import { template } from './template.js'
import { style } from './style.js'

const types = ['primary', 'danger', 'warning', 'success'] as const

@defineClass({
  customElement: 'bl-tag',
  styles: [style],
})
export class BlocksTag extends Component {
  @attr('boolean') accessor round!: boolean

  @attr('enum', { enumValues: types }) accessor type!: (typeof types)[number]

  @attr('boolean') accessor closeable!: boolean

  @attr('boolean') accessor outline!: boolean

  @attrs.size accessor size!: EnumAttrs['size']

  @domRef('#layout') accessor $layout!: HTMLElement

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

    shadowRoot.addEventListener('click', e => {
      if (getElementTarget(e)?.id === 'close') {
        dispatchEvent(this, 'close')
      }
    })
  }

  override render() {
    if (this.closeable) {
      if (!this.shadowRoot!.getElementById('close')) {
        const button = this.$layout.appendChild(
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
