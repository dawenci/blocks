import { defineClass } from '../../decorators/defineClass.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-loading',
  styles: [style],
})
export class BlocksLoading extends Component {
  @shadowRef('#layout') accessor $layout!: HTMLElement

  $icon?: SVGElement

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())

    this.onConnected(this.render)
  }

  override render() {
    super.render()
    if (!this.$icon) {
      this.$icon = getRegisteredSvgIcon('loading')!
      this.$layout.appendChild(this.$icon)
    }
  }
}
