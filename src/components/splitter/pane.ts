import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { style } from './pane.style.js'
import { template } from './pane.template.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-splitter-pane',
  styles: [style],
})
export class BlSplitterPane extends BlComponent {
  // 弹性尺寸基础值
  @attr('number') accessor basis = 0
  // 弹性尺寸增长率
  @attr('number') accessor grow = 1
  // 弹性尺寸收缩率
  @attr('number') accessor shrink = 1
  // 最大尺寸
  @attr('number') accessor max = Infinity
  // 最小尺寸
  @attr('number') accessor min = 0

  collapseSize?: number

  constructor() {
    super()

    this.appendShadowChild(template())

    const onMouseEnter = () => {
      this.getSplitter().setActiveHandle(this)
    }
    this.hook.onConnected(() => {
      this.addEventListener('mouseenter', onMouseEnter)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('mouseenter', onMouseEnter)
    })

    this.hook.onConnected(this.render)
  }

  _size?: number | null
  get size() {
    return this._size ?? this.basis
  }

  set size(value) {
    this._size = value
  }

  private getSplitter() {
    return this.closest('bl-splitter')!
  }

  updateStyle() {
    const sizeProp = this.getSplitter().direction === 'horizontal' ? 'width' : 'height'
    const posProp = this.getSplitter().direction === 'horizontal' ? 'left' : 'top'
    // 宽度/高度 样式计算，外框宽度 - 拖动柄的宽度（如果显示拖动柄）
    this.style[sizeProp] = this.getSplitter().getPaneSize(this) + 'px'
    this.style[posProp] = this.getSplitter().getPanePosition(this) + 'px'
  }

  collapse() {
    this.getSplitter().collapsePane(this)
  }

  expand() {
    this.getSplitter().expandPane(this)
  }
}
