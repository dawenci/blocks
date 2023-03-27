import type { EnumAttrs } from '../../decorators/attr.js'
import { attr, attrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { getElementTarget } from '../../common/getElementTarget.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'

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

  @shadowRef('#layout') accessor $layout!: HTMLElement

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

    const onClick = (e: MouseEvent) => {
      if (getElementTarget(e)?.id === 'close') {
        dispatchEvent(this, 'close')
      }
    }
    this.onConnected(() => {
      this.$layout.addEventListener('click', onClick)
    })
    this.onDisconnected(() => {
      this.$layout.removeEventListener('click', onClick)
    })

    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
  }

  override render() {
    super.render()
    if (this.closeable) {
      if (!this.shadowRoot!.getElementById('close')) {
        const button = this.$layout.appendChild(document.createElement('button'))
        button.id = 'close'
      }
    } else {
      const button = this.shadowRoot!.getElementById('close')
      if (button) {
        button.parentElement!.removeChild(button)
      }
    }
  }
}
