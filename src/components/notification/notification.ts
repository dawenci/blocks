import type { NullableEnumAttr } from '../../decorators/attr.js'
import { __color_success, __color_danger, __color_warning, __color_primary } from '../../theme/var-light.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'

export enum NotificationPlacement {
  TopRight = 'top-right',
  BottomRight = 'bottom-right',
  BottomLeft = 'bottom-left',
  TopLeft = 'top-left',
}

export enum NotificationType {
  Message = 'message',
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}
export const notificationTypes = [
  NotificationType.Message,
  NotificationType.Success,
  NotificationType.Error,
  NotificationType.Info,
  NotificationType.Warning,
]

export interface BlocksNotification extends Component {
  ref: {
    $layout: HTMLElement
    $icon: HTMLElement
    $content: HTMLElement
    $close?: HTMLButtonElement
  }
}

@defineClass({
  customElement: 'bl-notification',
  styles: [style],
})
export class BlocksNotification extends Component {
  @attr('boolean') accessor closeable!: boolean

  @attr('number') accessor duration = 10

  @attr('enum', { enumValues: notificationTypes })
  accessor type!: NullableEnumAttr<typeof notificationTypes>

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())
    const $layout = shadowRoot.querySelector('#layout') as HTMLElement
    const $icon = shadowRoot.querySelector('#icon') as HTMLElement
    const $content = shadowRoot.querySelector('#content') as HTMLElement

    this.ref = {
      $layout,
      $icon,
      $content,
    }

    this.#setupAutoClose()

    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
  }

  #setupAutoClose() {
    this.onConnected(() => {
      this._setAutoClose()
    })

    this.onAttributeChangedDep('duration', () => {
      if (this.duration) this._setAutoClose()
    })

    this.ref.$layout.onmouseenter = () => {
      this._clearAutoClose()
    }

    this.ref.$layout.onmouseleave = () => {
      this._setAutoClose()
    }
  }

  close() {
    if (!this.parentElement) return
    this.ontransitionend = e => {
      if (e.propertyName === 'opacity' && e.target === this) {
        dispatchEvent(this, 'closed')
        this.destroy()
      }
    }
    if (this.parentElement.className.includes('bottom')) {
      this.style.cssText = `transform:translate(0,100%);opacity:0`
    } else {
      this.style.cssText = `transform:translate(0,-100%);opacity:0`
    }
  }

  override render() {
    super.render()
    const fill =
      this.type === 'success'
        ? __color_success
        : this.type === 'error'
        ? __color_danger
        : this.type === 'warning'
        ? __color_warning
        : this.type === 'info'
        ? __color_primary
        : undefined
    const iconName = this.type === 'warning' ? 'info' : this.type ?? ''
    const $icon = getRegisteredSvgIcon(iconName, { fill })
    if ($icon) {
      this.ref.$icon.innerHTML = ''
      this.ref.$icon.appendChild($icon)
    }

    if (this.closeable) {
      if (!this.ref.$close) {
        this.ref.$close = this.ref.$layout.appendChild(document.createElement('button'))
        this.ref.$close.id = 'close'
        this.ref.$close.appendChild(getRegisteredSvgIcon('cross')!)
        this.ref.$close.onclick = () => {
          this.close()
        }
      }
    } else {
      if (this.ref.$close) {
        this.ref.$close.parentElement!.removeChild(this.ref.$close)
        this.ref.$close = undefined
      }
    }
  }

  destroy() {
    this._clearAutoClose()
    if (this.parentElement) {
      this.parentElement.removeChild(this)
    }
  }

  #autoCloseTimer?: ReturnType<typeof setTimeout>
  _clearAutoClose() {
    clearTimeout(this.#autoCloseTimer)
  }

  _setAutoClose() {
    if (this.duration && this.duration > 0) {
      this._clearAutoClose()
      this.#autoCloseTimer = setTimeout(() => {
        this.close()
      }, this.duration * 1000)
    }
  }
}
