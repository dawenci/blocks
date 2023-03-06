import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'
import { applyStyle } from '../../decorators/style.js'
import { style } from './style.js'
import { ControlBox } from '../base-control-box/index.js'
import { labelTemplate } from './template.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'

const types = ['primary', 'danger', 'warning', 'success', 'link'] as const

export interface BlocksButton extends ControlBox {
  _ref: ControlBox['_ref'] & {
    $content: HTMLSpanElement
    $slot: HTMLSlotElement
    $icon?: HTMLElement | null
  }

  _observer: MutationObserver
}

@customElement('bl-button')
@applyStyle(style)
export class BlocksButton extends ControlBox {
  static get role() {
    return 'button'
  }

  static override get observedAttributes() {
    return super.observedAttributes.concat(['type', 'size'])
  }

  @attr('string') accessor icon!: string | null

  @attr('boolean') accessor block!: boolean

  @attr('enum', {
    enumValues: types,
  })
  accessor type!: typeof types | null

  @attr('enum', { enumValues: ['small', 'large'] })
  accessor size!: 'small' | 'large' | null

  constructor() {
    super()

    this._appendContent(labelTemplate())
    this._ref.$content = this.querySelectorShadow<HTMLSpanElement>('#content')!
    this._ref.$slot = this.querySelectorShadow('slot')!

    captureEventWhenEnable(this, 'keydown', e => {
      if (e.keyCode === 32 || e.keyCode === 13) {
        // 阻止空格键的页面滚动行为
        e.preventDefault()

        this.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          })
        )
      }
    })

    // disabled 状态，阻止点击
    captureEventWhenEnable(this, 'click', () => {
      // noop
    })

    this._observer = new MutationObserver(() => {
      this.setAttribute('aria-label', this.textContent ?? '')
    })
  }

  override render() {
    super.render()
    this._ref.$layout.classList.toggle(
      'empty',
      !this._ref.$slot.assignedNodes().length
    )
  }

  override connectedCallback() {
    super.connectedCallback()
    this.internalTabIndex = '0'

    this._observer.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    this.render()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()

    this._observer.disconnect()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    switch (attrName) {
      case 'type': {
        return this.render()
      }
      case 'size': {
        return this.render()
      }
    }
  }
}
