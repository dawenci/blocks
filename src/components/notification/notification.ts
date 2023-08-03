import { __color_success, __color_danger, __color_warning, __color_primary } from '../../theme/var-light.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { unmount } from '../../common/mount.js'
import { BlComponent } from '../component/Component.js'

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

export interface BlNotification extends BlComponent {
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
export class BlNotification extends BlComponent {
  @attr('boolean') accessor closeable!: boolean

  @attr('number') accessor duration = 10

  @attr('enum', { enumValues: notificationTypes })
  accessor type!:  MaybeOneOf<typeof notificationTypes>

  @shadowRef('#layout') accessor $layout!: HTMLElement
  @shadowRef('#icon') accessor $icon!: HTMLElement
  @shadowRef('#content') accessor $content!: HTMLElement
  @shadowRef('#close', false) accessor $close!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupAutoClose()

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  #setupAutoClose() {
    this.hook.onConnected(() => {
      this._setAutoClose()
    })

    this.hook.onAttributeChangedDep('duration', () => {
      if (this.duration) this._setAutoClose()
    })

    this.$layout.onmouseenter = () => {
      this._clearAutoClose()
    }

    this.$layout.onmouseleave = () => {
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
      this.$icon.innerHTML = ''
      this.$icon.appendChild($icon)
    }

    if (this.closeable) {
      if (!this.$close) {
        const $close = document.createElement('button')
        $close.id = 'close'
        $close.appendChild(getRegisteredSvgIcon('cross')!)
        $close.onclick = () => {
          this.close()
        }
        this.$layout.appendChild($close)
      }
    } else {
      if (this.$close) {
        unmount(this.$close)
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
