import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { Component } from '../Component.js'
import { template } from './pane.template.js'
import { style } from './pane.style.js'

@defineClass({
  customElement: 'bl-splitter-pane',
  styles: [style],
})
export class BlocksSplitterPane extends Component {
  static override get observedAttributes() {
    return [
      // 弹性尺寸基础值
      'basis',
      // 弹性尺寸增长率
      'grow',
      // 最大尺寸
      'max',
      // 最小尺寸
      'min',
      // 弹性尺寸收缩率
      'shrink',
    ]
  }

  @attr('number') accessor basis = 0

  @attr('number') accessor grow = 1

  @attr('number') accessor shrink = 1

  @attr('number') accessor max = Infinity

  @attr('number') accessor min = 0

  collapseSize?: number

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())
    this.addEventListener('mouseenter', () => {
      this.getSplitter().setActiveHandle(this)
    })
  }

  _size?: number | null
  get size() {
    return this._size ?? this.basis
  }

  set size(value) {
    this._size = value
  }

  getSplitter() {
    return this.closest('bl-splitter')!
  }

  updateStyle() {
    const sizeProp =
      this.getSplitter().direction === 'horizontal' ? 'width' : 'height'
    const posProp =
      this.getSplitter().direction === 'horizontal' ? 'left' : 'top'
    // 宽度/高度 样式计算，外框宽度 - 拖动柄的宽度（如果显示拖动柄）
    this.style[sizeProp] = this.getSplitter().getPaneSize(this) + 'px'
    this.style[posProp] = this.getSplitter().getPanePosition(this) + 'px'
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  collapse() {
    this.getSplitter().collapsePane(this)
  }

  expand() {
    this.getSplitter().expandPane(this)
  }
}
