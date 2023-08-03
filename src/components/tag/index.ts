import type { BlCloseButton } from '../close-button/index.js'
import '../close-button/index.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { unmount } from '../../common/mount.js'
import { BlComponent } from '../component/Component.js'

const types = ['primary', 'danger', 'warning', 'success'] as const

@defineClass({
  customElement: 'bl-tag',
  styles: [style],
})
export class BlTag extends BlComponent {
  @attr('boolean') accessor round!: boolean

  @attr('enum', { enumValues: types }) accessor type!: (typeof types)[number]

  @attr('boolean') accessor closeable!: boolean

  @attr('boolean') accessor outline!: boolean

  @attrs.size accessor size!: MaybeOneOf<['small' | 'large']>

  @shadowRef('#layout') accessor $layout!: HTMLElement
  @shadowRef('[part="close"]', false) accessor $close!: BlCloseButton

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())
    this.#setupClose()
  }

  #setupClose() {
    const update = () => {
      if (this.closeable) {
        if (!this.$close) {
          const $close = this.$layout.appendChild(document.createElement('bl-close-button'))
          $close.setAttribute('part', 'close')
          $close.onclick = () => {
            dispatchEvent(this, 'close')
          }
        }
      } else {
        if (this.$close) {
          unmount(this.$close)
        }
      }
    }

    this.hook.onRender(update)
    this.hook.onConnected(update)
    this.hook.onAttributeChangedDep('closeable', update)
  }
}
