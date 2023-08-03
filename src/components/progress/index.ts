import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlComponent } from '../component/Component.js'

const status = ['success', 'error', 'warning']

@defineClass({
  customElement: 'bl-progress',
  styles: [style],
})
export class BlProgress extends BlComponent {
  static override get role() {
    return 'progressbar'
  }

  @attr('number') accessor value!: number | null

  @attr('enum', { enumValues: status }) accessor status!:  MaybeOneOf<typeof status>

  @attr('boolean') accessor percentage!: boolean

  @shadowRef('[part="progress"]') accessor $progress!: HTMLElement
  @shadowRef('[part="value"]') accessor $value!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  override render() {
    super.render()
    this.$progress.style.width = `${this.value}%`
    if (this.percentage) {
      this.$value.style.display = 'block'
      this.$value.textContent = `${this.value}%`
    } else {
      this.$value.style.display = 'none'
    }
  }
}
