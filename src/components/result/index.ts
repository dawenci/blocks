import { defineClass } from '../../decorators/defineClass.js'
import { EnumAttrs, attr, attrs } from '../../decorators/attr.js'
import { ClearableControlBox } from '../base-clearable-control-box/index.js'
import { domRef } from '../../decorators/domRef.js'

@defineClass({
  customElement: 'bl-result',
})
export class BlocksResult extends ClearableControlBox {
  @attrs.size accessor size!: EnumAttrs['size']

  // TODO, placeholder 实现
  @attr('string') accessor placeholder!: string | null

  @domRef('#content') accessor $content!: HTMLElement

  @domRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    const $content = document.createElement('div')
    $content.id = 'content'
    $content.appendChild(document.createElement('slot'))
    this._appendContent($content)
  }
}
