import { defineClass } from '../../decorators/defineClass.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { style } from './style.js'
import { domRef } from '../../decorators/domRef.js'

@defineClass({
  customElement: 'bl-loading',
  styles: [style],
})
export class BlocksLoading extends Component {
  @domRef('#layout') accessor $layout!: HTMLElement

  $icon?: SVGElement

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())
  }

  override render() {
    if (!this.$icon) {
      this.$icon = getRegisteredSvgIcon('loading')!
      this.$layout.appendChild(this.$icon)
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }
}
