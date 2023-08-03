import { defineClass } from '../../decorators/defineClass/index.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlControl } from '../base-control/index.js'
import { SetupControlEvent } from '../setup-control-event/index.js'

@defineClass({
  customElement: 'bl-close-button',
  styles: [style],
})
export class BlCloseButton extends BlControl {
  static override get role() {
    return 'button'
  }

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTarget(() => [this.$layout]).withTabIndex(0)
  }

  _controlFeature = SetupControlEvent.setup({ component: this })
}
