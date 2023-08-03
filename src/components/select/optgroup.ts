import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { BlComponent } from '../component/Component.js'

@defineClass({
  customElement: 'bl-optgroup',
})
export class BlOptGroup extends BlComponent {
  @attr('string') accessor label!: string

  @attr('boolean') accessor disabled!: boolean

  constructor() {
    super()
    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }
}
