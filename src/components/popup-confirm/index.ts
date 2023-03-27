import type { EnumAttr } from '../../decorators/attr.js'
import '../popup/index.js'
import { __color_warning } from '../../theme/var-light.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { popupTemplate } from './popup.template.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksButton } from '../button/index.js'
import { Component } from '../component/Component.js'
import { PopupOrigin } from '../popup/index.js'

const POPUP_ATTRS = ['open', 'origin'] as const
const CONFIRM_ATTRS = ['message', 'icon'] as const
const originArray = Object.values(PopupOrigin)

export interface BlocksPopupConfirm extends Component {
  $popup: BlocksPopup
  $message: HTMLElement
  $confirm: BlocksButton
  $cancel: BlocksButton

  onConfirm?: () => Promise<any>
  onCancel?: () => Promise<any>
}

// TODO: popup 弹出后，聚焦按钮
@defineClass({
  customElement: 'bl-popup-confirm',
  styles: [style],
})
export class BlocksPopupConfirm extends Component {
  static override get observedAttributes() {
    return [...POPUP_ATTRS, ...CONFIRM_ATTRS]
  }

  @attr('string') accessor icon = ''

  @attr('string') accessor message = ''

  @attr('boolean') accessor open!: boolean

  @attr('enum', { enumValues: originArray })
  accessor origin: EnumAttr<typeof originArray> = PopupOrigin.TopCenter

  constructor() {
    super()

    this.shadowRoot!.appendChild(template())

    this.#setupPopup()
    this.#setupActions()
    this.#setupTrigger()

    this.onAttributeChangedDep('message', () => {
      this.render()
    })
  }

  confirm() {
    let maybePromise: Promise<any> | undefined
    if (typeof this.onConfirm === 'function') {
      maybePromise = this.onConfirm()
    }
    dispatchEvent(this, 'confirm')

    if (maybePromise instanceof Promise) {
      this.$confirm.loading = true
      this.$cancel.disabled = true
      maybePromise
        .then(() => {
          this.open = false
        })
        .finally(() => {
          this.$cancel.disabled = false
          this.$confirm.loading = false
        })
    } else {
      this.open = false
    }
  }

  cancel() {
    let maybePromise
    if (typeof this.onCancel === 'function') {
      maybePromise = this.onCancel()
    }
    dispatchEvent(this, 'cancel')

    if (maybePromise instanceof Promise) {
      this.$confirm.disabled = true
      this.$cancel.loading = true
      maybePromise
        .then(() => {
          this.open = false
        })
        .finally(() => {
          this.$confirm.disabled = false
          this.$cancel.loading = false
        })
    } else {
      this.open = false
    }
  }

  #setupPopup() {
    this.$popup = popupTemplate()!
    this.$message = this.$popup.querySelector('.message')!
    this.$cancel = this.$popup.querySelector('.cancel')!
    this.$confirm = this.$popup.querySelector('.confirm')!
    this.$popup.anchorElement = () => this
    this.$popup.arrow = 8
    this.$popup.origin = this.origin
    this.$popup.style.padding = '15px;'

    this.onConnected(() => {
      document.body.appendChild(this.$popup)
      this.render()
    })
    this.onDisconnected(() => {
      if (this.$popup.parentElement) {
        this.$popup.parentElement.removeChild(this.$popup)
      }
    })
    this.onAttributeChangedDeps(POPUP_ATTRS, (attrName, _, newValue) => {
      if (attrName === 'open') {
        this.$popup.open = this.open
      } else {
        this.$popup.setAttribute(attrName, newValue as string)
      }
    })
    this.$popup.addEventListener('opened', () => {
      this.$cancel.focus()
    })
  }

  #setupActions() {
    const onConfirm = () => {
      this.confirm()
    }
    const onCancel = () => {
      this.cancel()
    }
    this.onConnected(() => {
      this.$cancel.addEventListener('click', onCancel)
      this.$confirm.addEventListener('click', onConfirm)
    })
    this.onDisconnected(() => {
      this.$cancel.removeEventListener('click', onCancel)
      this.$confirm.removeEventListener('click', onConfirm)
    })
  }

  #setupTrigger() {
    const onClick = () => {
      this.open = true
    }
    this.onConnected(() => {
      this.addEventListener('click', onClick)
    })
    this.onDisconnected(() => {
      this.removeEventListener('click', onClick)
    })
  }

  _renderIcon() {
    if (this.icon) {
      const icon = getRegisteredSvgIcon(this.icon)
      if (icon) {
        this.$message.style.paddingLeft = '20px'
        icon.style.cssText = `position:absolute;top:0;left:0;width:16px;height:16px;fill:var(--bl-color-warning-base, ${__color_warning});`
        this.$message.appendChild(icon)
      }
    } else {
      this.$message.style.paddingLeft = ''
    }
  }

  override render() {
    super.render()
    this.$message.innerHTML = ''
    this._renderIcon()
    const $content = document.createElement('div')
    $content.textContent = this.message
    this.$message.appendChild($content)
  }
}
