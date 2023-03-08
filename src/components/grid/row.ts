import { Component } from '../Component.js'
import { BlocksColumn } from './column.js'
import { template } from './row-template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import type { NullableEnumAttr } from '../../decorators/attr.js'

export interface BlocksRow extends Component {
  _ref: {
    $slot: HTMLSlotElement
  }
}

@defineClass({
  customElement: 'bl-row',
})
export class BlocksRow extends Component {
  static override get observedAttributes() {
    return [
      // 子元素垂直对齐方式
      'align',
      // 栅格之间的间隙尺寸
      'gutter',
      // 水平排列方式
      'justify',
      // 是否允许换行
      'wrap',
    ]
  }

  @attr('int') accessor gutter = 0

  @attr('boolean') accessor wrap!: boolean

  @attr('enum', { enumValues: ['top', 'middle', 'bottom'] })
  accessor align!: NullableEnumAttr<['top', 'middle', 'bottom']>

  @attr('enum', {
    enumValues: ['start', 'end', 'center', 'space-around', 'space-between'],
  })
  accessor justify!: NullableEnumAttr<
    ['start', 'end', 'center', 'space-around', 'space-between']
  >

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template().content.cloneNode(true))
    this._ref = {
      $slot: shadowRoot.querySelector('slot')!,
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this._renderGutter()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'gutter') {
      this._renderGutter()
    }
  }

  _renderGutter() {
    const cols = this._ref.$slot.assignedElements() as BlocksColumn[]

    if (this.gutter) {
      const half = this.gutter / 2
      this.style.marginLeft = -half + 'px'
      this.style.marginRight = -half + 'px'
      cols.forEach($col => {
        $col.style.paddingLeft = half + 'px'
        $col.style.paddingRight = half + 'px'
      })
    } else {
      this.style.marginLeft = ''
      this.style.marginRight = ''
      cols.forEach($col => {
        $col.style.paddingLeft = ''
        $col.style.paddingRight = ''
      })
    }
  }
}
