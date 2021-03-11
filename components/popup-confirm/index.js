import '../popup/index.js'
import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach, makeRgbaColor } from '../../common/utils.js'
import {
  __font_family,
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __fg_disabled,
  __border_color_base,
  __border_color_disabled,
  __bg_disabled,
  __transition_duration,
  __color_warning,
} from '../theme/var.js'
import { dispatchEvent } from '../../common/event.js';
import { getRegisteredSvgIcon } from '../../icon/index.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
  display: inline-block;
}
</style>
<slot></slot>
`

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = `
<bl-popup>
  <div class="layout" style="padding:15px;">
    <div class="message" style="position:relative;box-sizing:border-box;margin-bottom:15px;font-size:12px;line-height:18px;"></div>
    <div class="actions" style="box-sizing:border-box;text-align:center;">
      <bl-button size="small" class="cancel" style="margin:0 5px;vertical-align:middle;">取消</bl-button>
      <bl-button size="small" class="confirm" type="primary" style="margin:0 5px;vertical-align:middle;">确定</bl-button>
    </div>
  </div>
</bl-popup>
`

const POPUP_ATTRS = ['open', 'origin']

export default class BlocksPopupConfirm extends HTMLElement {
  static get observedAttributes() {
    return POPUP_ATTRS.concat(['message', 'icon'])
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    this.shadowRoot.appendChild(template.content.cloneNode(true))

    const popupFragment = popupTemplate.content.cloneNode(true)
    this.$popup = popupFragment.querySelector('bl-popup')
    this.$message = popupFragment.querySelector('.message')
    this.$cancel = popupFragment.querySelector('.cancel')
    this.$confirm = popupFragment.querySelector('.confirm')
    this.$popup.anchor = this
    this.$popup.arrow = true
    this.$popup.origin = this.origin || 'top-center'
    this.$popup.style.padding = '15px;'

    this.onclick = () => {
      this.open = true
    }

    this.$cancel.addEventListener('click', (e) => {
      this._cancel()
    })

    this.$confirm.addEventListener('click', (e) => {
      this._confirm()
    })
  }

  get icon() {
    return this.getAttribute('icon')
  }

  set icon(value) {
    this.setAttribute('icon', value)
  }

  get message() {
    return this.getAttribute('message') ?? ''
  }

  set message(value) {
    this.setAttribute('message', value)
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

  get origin() {
    return this.$popup.origin
  }

  set origin(value) {
    this.$popup.origin = value
  }

  _confirm() {
    let maybePromise
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
    }
    else {
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
      maybePromise.then(() => this.open = false)
    }
    else {
      this.open = false
    }
  }
  
  renderIcon() {
    if (this.icon) {
      const icon = getRegisteredSvgIcon(this.icon)
      if (icon) {
        this.$message.style.paddingLeft = '20px'
        icon.style.cssText = `position:absolute;top:0;left:0;width:16px;height:16px;fill:var(--color-warning, ${__color_warning});`
        this.$message.appendChild(icon)
      }
    }
    else {
      this.$message.style.paddingLeft = ''
    }
  }

  render() {
    this.$message.innerHTML = ''
    this.renderIcon()
    const $content = document.createElement('div')
    $content.textContent = this.message
    this.$message.appendChild($content)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    document.body.appendChild(this.$popup)
    this.render()
  }

  disconnectedCallback() {
    if (this.$popup.parentElement) {
      this.$popup.parentElement.removeChild(this.$popup)
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (POPUP_ATTRS.includes(attrName)) {
      this.$popup.setAttribute(attrName, newValue)
    }
    if (attrName === 'message') {
      this.render()
    }
  }
}

if (!customElements.get('bl-popup-confirm')) {
  customElements.define('bl-popup-confirm', BlocksPopupConfirm)
}
