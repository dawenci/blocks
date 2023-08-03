import '../popup/index.js'
import { __color_warning } from '../../theme/var-light.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { popupTemplate, template } from './template.js'
import { style } from './style.js'
import { unmount } from '../../common/mount.js'
import { BlPopup } from '../popup/index.js'
import { BlButton } from '../button/index.js'
import { BlComponent } from '../component/Component.js'

const CONFIRM_ATTRS = ['message', 'icon'] as const

export interface BlPopupConfirm extends BlComponent {
  $popup: BlPopup
  $message: HTMLElement
  $confirm: BlButton
  $cancel: BlButton

  onConfirm?: () => Promise<any>
  onCancel?: () => Promise<any>
}

@defineClass({
  customElement: 'bl-popup-confirm',
  styles: [style],
})
export class BlPopupConfirm extends BlComponent {
  static override get observedAttributes() {
    return [...BlPopup.observedAttributes, ...CONFIRM_ATTRS]
  }

  @attr('string') accessor icon = ''

  @attr('string') accessor message = ''

  @attr('boolean') accessor open!: boolean

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupPopup()
    this.#setupActions()
    this.#setupTrigger()

    this.hook.onAttributeChangedDep('message', () => {
      this.render()
    })
    this.hook.onConnected(() => {
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
      return maybePromise
        .then(() => {
          this.open = false
        })
        .finally(() => {
          this.$cancel.disabled = false
          this.$confirm.loading = false
        })
    } else {
      this.open = false
      return Promise.resolve()
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
      return maybePromise
        .then(() => {
          this.open = false
        })
        .finally(() => {
          this.$confirm.disabled = false
          this.$cancel.loading = false
        })
    } else {
      this.open = false
      return Promise.resolve()
    }
  }

  #setupPopup() {
    this.$popup = popupTemplate()!
    this.$popup.anchorElement = () => this
    this.$message = this.$popup.querySelector('.message')!
    this.$cancel = this.$popup.querySelector('.cancel')!
    this.$confirm = this.$popup.querySelector('.confirm')!

    this.hook.onDisconnected(() => {
      unmount(this.$popup)
    })
    this.hook.onAttributeChangedDeps(BlPopup.observedAttributes, (name, _, newValue) => {
      if (name === 'open') {
        // 首次打开的时候，挂载 $popup 的 DOM
        if (this.open && !document.body.contains(this.$popup)) {
          document.body.appendChild(this.$popup)
        }
        this.$popup.open = this.open
      } else {
        this.$popup.setAttribute(name, newValue as string)
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
    this.hook.onConnected(() => {
      this.$cancel.addEventListener('click', onCancel)
      this.$confirm.addEventListener('click', onConfirm)
    })
    this.hook.onDisconnected(() => {
      this.$cancel.removeEventListener('click', onCancel)
      this.$confirm.removeEventListener('click', onConfirm)
    })
  }

  #setupTrigger() {
    const onClick = () => {
      this.open = true
    }
    this.hook.onConnected(() => {
      this.addEventListener('click', onClick)
    })
    this.hook.onDisconnected(() => {
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
