import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './row.style.js'
import { template } from './row.template.js'
import { BlColumn } from './column.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-row',
  styles: [style],
})
export class BlRow extends BlComponent {
  static override get role() {
    return 'row'
  }

  /** 栅格之间的间隙尺寸 */
  @attr('int') accessor gutter = 0

  /** 是否允许换行 */
  @attr('boolean', { observed: false }) accessor wrap!: boolean

  /** 子元素垂直对齐方式 */
  @attr('enum', { enumValues: ['top', 'middle', 'bottom'], observed: false })
  accessor align!:  MaybeOneOf<['top', 'middle', 'bottom']>

  /** 水平排列方式 */
  @attr('enum', {
    enumValues: ['start', 'end', 'center', 'space-around', 'space-between'],
    observed: false,
  })
  accessor justify!:  MaybeOneOf<['start', 'end', 'center', 'space-around', 'space-between']>

  @shadowRef('slot') accessor $slot!: HTMLSlotElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupGutter()
  }

  #setupGutter() {
    const _renderGutter = () => {
      const cols = this.$slot.assignedElements() as BlColumn[]

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

    this.hook.onConnected(() => {
      _renderGutter()
    })

    this.hook.onAttributeChangedDep('gutter', () => {
      _renderGutter()
    })
  }
}
