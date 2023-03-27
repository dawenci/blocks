import type { NullableEnumAttr } from '../../decorators/attr.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'

const status = ['success', 'error', 'warning']

export interface BlocksProgress extends Component {
  _ref: {
    $progress: HTMLElement
    $value: HTMLElement
  }
}

@defineClass({
  customElement: 'bl-progress',
  styles: [style],
})
export class BlocksProgress extends Component {
  @attr('number') accessor value!: number | null

  @attr('enum', { enumValues: status }) accessor status!: NullableEnumAttr<typeof status>

  @attr('boolean') accessor percentage!: boolean

  @shadowRef('#progress') accessor $progress!: HTMLElement

  @shadowRef('#value') accessor $value!: HTMLElement

  constructor() {
    super()

    this.shadowRoot!.appendChild(template())

    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
  }

  override render() {
    super.render()
    this.$progress.style.width = `${this.value}%`
    if (this.percentage) {
      this.$value.style.display = 'block'
      this.$value.textContent = `${this.value}%`
    } else {
      this.$value.style.display = 'none'
    }
  }
}
