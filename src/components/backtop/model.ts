import { BlModel } from '../../common/BlModel.js'

class BacktopModel extends BlModel<{
  /** 当前滚动位置 */
  scrolled: number
  /** 滚动动画持续时间 */
  duration: number
  /** 触发显示的距离 */
  threshold: number
  /** 是否显示 */
  visible: boolean
}> {
  override data = {
    scrolled: 0,
    duration: 0,
    threshold: 400,
    visible: false,
  }

  constructor() {
    super()
    this.on('update:scrolled update:threshold', () => {
      this.set('visible', this.data.scrolled >= this.data.threshold)
    })
  }
}

export const make = () => new BacktopModel()
