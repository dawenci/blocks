import { defineClass } from '../../decorators/defineClass.js'
import { NullableEnumAttr, attr } from '../../decorators/attr.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { style } from './style.js'
import { domRef } from '../../decorators/domRef.js'

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

  @domRef('#progress') accessor $progress!: HTMLElement

  @domRef('#value') accessor $value!: HTMLElement

  constructor() {
    super()

    this.shadowRoot!.appendChild(template())
  }

  override render() {
    this.$progress.style.width = `${this.value}%`
    if (this.percentage) {
      this.$value.style.display = 'block'
      this.$value.textContent = `${this.value}%`
    } else {
      this.$value.style.display = 'none'
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(attrName: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.render()
  }
}
