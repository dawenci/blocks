import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import { ClearableControlBox } from '../base-clearable-control-box/index.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'

export interface BlocksResult extends ClearableControlBox {
  _ref: ClearableControlBox['_ref'] & {
    $content: HTMLElement
    $slot: HTMLSlotElement
  }
}

@defineClass({
  customElement: 'bl-result',
})
export class BlocksResult extends ClearableControlBox {
  static override get observedAttributes() {
    return ['size', 'placeholder'].concat(super.observedAttributes)
  }

  // TODO, placeholder 实现
  @attr('string') accessor placeholder!: string | null

  constructor() {
    super()

    const $content = document.createElement('div')
    $content.id = 'content'
    const $slot = $content.appendChild(document.createElement('slot'))
    this._appendContent($content)

    this._ref.$content = $content
    this._ref.$slot = $slot
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }
}
