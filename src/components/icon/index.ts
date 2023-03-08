import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { domRef } from '../../decorators/domRef.js'
import { style } from './style.js'
import { getRegisteredSvgIcon, parseSvg } from '../../icon/index.js'
import { Component } from '../Component.js'
import { template } from './template.js'

@defineClass({
  customElement: 'bl-icon',
  styles: [style],
})
export class BlocksIcon extends Component {
  @attr('string') accessor value!: string | null

  @attr('string') accessor fill!: string | null

  @domRef('#layout') accessor $layout!: HTMLElement

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())
  }

  override render() {
    const { $layout } = this
    if ($layout.firstElementChild) {
      $layout.removeChild($layout.firstElementChild)
    }

    const attrs: Record<string, string> = {}
    if (this.fill) {
      attrs.fill = this.fill
    }

    const icon =
      getRegisteredSvgIcon(this.value ?? '', attrs) ??
      parseSvg(this.value ?? '', attrs)

    if (icon) {
      $layout.appendChild(icon)
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
