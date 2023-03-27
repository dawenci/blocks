import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { Component } from '../component/Component.js'

@defineClass({
  customElement: 'bl-optgroup',
})
export class BlocksOptGroup extends Component {
  @attr('string') accessor label!: string

  @attr('boolean') accessor disabled!: boolean

  constructor() {
    super()
    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
  }
}
