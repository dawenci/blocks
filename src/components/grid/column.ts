import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { style } from './column.style.js'
import { template } from './column.template.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-col',
  styles: [style],
})
export class BlocksColumn extends Component {
  /** 往左移动多少个栅格列（通过 right 定位属性往左推） */
  @attr('intRange', { min: 1, max: 23, observed: false }) accessor pull!: number

  /** 往右移动多少个栅格列（通过 left 定位属性往右推） */
  @attr('intRange', { min: 1, max: 23, observed: false }) accessor push!: number

  /** 尺寸横跨多少个栅格列 */
  @attr('intRange', { min: 1, max: 24, observed: false }) accessor span!: number

  /** 左侧空出多少个栅格列 */
  @attr('intRange', { min: 1, max: 23, observed: false })
  accessor offset!: number

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())
  }
}
