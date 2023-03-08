import '../popup/index.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { style } from './style.js'
import { template } from './template.js'
import { popupTemplate } from './popup.template.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksButton } from '../button/index.js'
import { Component } from '../Component.js'
import { __color_warning } from '../../theme/var-light.js'

const POPUP_ATTRS = ['open', 'origin']
const CONFIRM_ATTRS = ['message', 'icon']

@defineClass({
  customElement: 'bl-popup-confirm',
  styles: [style],
})
export class BlocksPopupConfirm extends Component {
  private $popup: BlocksPopup
  private $message: HTMLElement
  private $confirm: BlocksButton
  private $cancel: BlocksButton

  confirm?: () => Promise<any>
  cancel?: () => Promise<any>

  static override get observedAttributes() {
    return POPUP_ATTRS.concat(CONFIRM_ATTRS)
  }

  @attr('string') accessor icon = ''

  @attr('string') accessor message = ''

  constructor() {
    super()

    this.shadowRoot!.appendChild(template())

    this.$popup = popupTemplate()!
    this.$message = this.$popup.querySelector('.message')!
    this.$cancel = this.$popup.querySelector('.cancel')!
    this.$confirm = this.$popup.querySelector('.confirm')!
    this.$popup.anchor = this
    this.$popup.arrow = true
    this.$popup.origin = this.origin || 'top-center'
    this.$popup.style.padding = '15px;'

    this.onclick = () => {
      this.open = true
    }

    this.$cancel.addEventListener('click', () => {
      this._cancel()
    })

    this.$confirm.addEventListener('click', () => {
      this._confirm()
    })
  }

  get origin() {
    return this.$popup.origin
  }

  set origin(value) {
    this.$popup.origin = value
  }

  get open() {
    return this.$popup.open
  }

  set open(value) {
    this.$popup.open = value
  }

  _confirm() {
    let maybePromise: Promise<any> | undefined
    if (typeof this.confirm === 'function') {
      maybePromise = this.confirm()
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

  _cancel() {
    let maybePromise
    if (typeof this.cancel === 'function') {
      maybePromise = this.cancel()
    }
    dispatchEvent(this, 'cancel')

    if (maybePromise instanceof Promise) {
      maybePromise.then(() => (this.open = false))
    } else {
      this.open = false
    }
  }

  renderIcon() {
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
    this.$message.innerHTML = ''
    this.renderIcon()
    const $content = document.createElement('div')
    $content.textContent = this.message
    this.$message.appendChild($content)
  }

  override connectedCallback() {
    super.connectedCallback()
    document.body.appendChild(this.$popup)
    this.render()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this.$popup.parentElement) {
      this.$popup.parentElement.removeChild(this.$popup)
    }
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (POPUP_ATTRS.includes(attrName)) {
      this.$popup.setAttribute(attrName, newValue)
    }
    if (attrName === 'message') {
      this.render()
    }
  }
}
