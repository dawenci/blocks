import {
  boolGetter,
  boolSetter,
  enumGetter,
  enumSetter,
} from '../../common/property.js'
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import { labelTemplate, styleTemplate } from './template.js'
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js'
import { ControlBox } from '../base-control-box/index.js'

const types = ['primary', 'danger', 'warning', 'success', 'link'] as const
const typeGetter = enumGetter('type', types)
const typeSetter = enumSetter('type', types)

export interface BlocksButton extends ControlBox {
  _ref: ControlBox['_ref'] & {
    $content: HTMLSpanElement
    $slot: HTMLSlotElement
    $icon?: HTMLElement | null
  }

  _observer: MutationObserver
}

export class BlocksButton extends ControlBox {
  static get role() {
    return 'button'
  }

  static override get observedAttributes() {
    return super.observedAttributes.concat(['type', 'size'])
  }

  constructor() {
    super()

    this._appendStyle(styleTemplate())
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

  get block() {
    return boolGetter('block')(this)
  }

  set block(value) {
    boolSetter('block')(this, value)
  }

  get type() {
    return typeGetter(this)
  }

  set type(value) {
    typeSetter(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get icon() {
    return this.getAttribute('icon')
  }

  set icon(value) {
    this.setAttribute('icon', value ?? '')
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

if (!customElements.get('bl-button')) {
  customElements.define('bl-button', BlocksButton)
}
