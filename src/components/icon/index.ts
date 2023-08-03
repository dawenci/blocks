import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-icon',
  styles: [style],
})
export class BlIcon extends BlComponent {
  @attr('string') accessor value!: string | null

  @attr('string') accessor fill!: string | null

  @shadowRef('#layout') accessor $layout!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  override render() {
    super.render()
    const { $layout } = this
    if ($layout.firstElementChild) {
      $layout.removeChild($layout.firstElementChild)
    }

    const attrs: Record<string, string> = {}
    if (this.fill) {
      attrs.fill = this.fill
    }

    const icon = getRegisteredSvgIcon(this.value ?? '', attrs) ?? parseSvg(this.value ?? '', attrs)

    if (icon) {
      $layout.appendChild(icon)
    }
  }
}
