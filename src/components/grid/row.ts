import type { NullableEnumAttr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { domRef } from '../../decorators/domRef.js'
import { template } from './row.template.js'
import { style } from './row.style.js'
import { Component } from '../Component.js'
import { BlocksColumn } from './column.js'

@defineClass({
  customElement: 'bl-row',
  styles: [style],
})
export class BlocksRow extends Component {
  /** 栅格之间的间隙尺寸 */
  @attr('int') accessor gutter = 0

  /** 是否允许换行 */
  @attr('boolean', { observed: false }) accessor wrap!: boolean

  /** 子元素垂直对齐方式 */
  @attr('enum', { enumValues: ['top', 'middle', 'bottom'], observed: false })
  accessor align!: NullableEnumAttr<['top', 'middle', 'bottom']>

  /** 水平排列方式 */
  @attr('enum', {
    enumValues: ['start', 'end', 'center', 'space-around', 'space-between'],
    observed: false,
  })
  accessor justify!: NullableEnumAttr<
    ['start', 'end', 'center', 'space-around', 'space-between']
  >

  @domRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())
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
    const cols = this.$slot.assignedElements() as BlocksColumn[]

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
