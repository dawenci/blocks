import { intRangeGetter, intRangeSetter } from '../../common/property.js'
import { Component } from '../Component.js'
import { template } from './column-template.js'

type DomRef = {
  $slot: HTMLSlotElement
}

export class BlocksColumn extends Component {
  ref: DomRef

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

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template().content.cloneNode(true))
    this.ref = { $slot: shadowRoot.querySelector('slot')! }
  }

  get pull() {
    return intRangeGetter('pull', 1, 23)(this)
  }

  set pull(value) {
    intRangeSetter('pull', 1, 23)(this, value)
  }

  get push() {
    return intRangeGetter('push', 1, 23)(this)
  }

  set push(value) {
    intRangeSetter('push', 1, 23)(this, value)
  }

  get span() {
    return intRangeGetter('span', 1, 24)(this)
  }

  set span(value) {
    intRangeSetter('span', 1, 24)(this, value)
  }

  get offset() {
    return intRangeGetter('offset', 1, 23)(this)
  }

  set offset(value) {
    intRangeSetter('offset', 1, 23)(this, value)
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }
}

if (!customElements.get('bl-col')) {
  customElements.define('bl-col', BlocksColumn)
}
