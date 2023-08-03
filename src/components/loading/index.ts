import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-loading',
  styles: [style],
})
export class BlLoading extends BlComponent {
  @shadowRef('#layout') accessor $layout!: HTMLElement

  $icon?: SVGElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.hook.onConnected(this.render)
  }

  override render() {
    super.render()
    if (!this.$icon) {
      this.$icon = getRegisteredSvgIcon('loading')!
      this.$layout.appendChild(this.$icon)
    }
  }
}
