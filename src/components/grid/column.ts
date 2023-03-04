import { Component } from '../Component.js'
import { template } from './column-template.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

export interface BlocksColumn extends Component {
  _ref: {
    $slot: HTMLSlotElement
  }
}

@customElement('bl-col')
export class BlocksColumn extends Component {
  static override get observedAttributes() {
    return [
      // 左侧空出多少个栅格列
      'offset',
      // 往左移动多少个栅格列（通过 right 定位属性往左推）
      'pull',
      // 往右移动多少个栅格列（通过 left 定位属性往右推）
      'push',
      // 尺寸横跨多少个栅格列
      'span',
    ]
  }

  @attr('intRange', { min: 1, max: 23 }) accessor pull!: number

  @attr('intRange', { min: 1, max: 23 }) accessor push!: number

  @attr('intRange', { min: 1, max: 24 }) accessor span!: number

  @attr('intRange', { min: 1, max: 23 }) accessor offset!: number

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))
    this._ref = { $slot: shadowRoot.querySelector('slot')! }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }
}
