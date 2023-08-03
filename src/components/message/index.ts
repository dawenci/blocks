import '../close-button/index.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlComponent } from '../component/Component.js'
import { unmount } from '../../common/mount.js'

@defineClass({
  customElement: 'bl-message',
  styles: [style],
})
export class BlMessage extends BlComponent {
  @attr('boolean') accessor closeable!: boolean

  @attr('number') accessor duration = 10

  @attr('enum', {
    enumValues: ['message', 'success', 'error', 'info', 'warning'],
  })
  accessor type!:  MaybeOneOf<['message', 'success', 'error', 'info', 'warning']>

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('[part="icon"]') accessor $icon!: HTMLElement
  @shadowRef('[part="content"]') accessor $content!: HTMLElement
  @shadowRef('[part="close"]', false) accessor $close!: HTMLButtonElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.#setupClose()
    this.#setupAutoClose()

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  #setupClose() {
    const update = () => {
      if (this.closeable) {
        if (!this.$close) {
          const $close = this.$layout.appendChild(document.createElement('bl-close-button'))
          $close.setAttribute('part', 'close')
          $close.onclick = () => {
            this.close()
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
    const iconName = this.type === 'warning' ? 'info' : this.type || ''
    const icon = getRegisteredSvgIcon(iconName)
    if (icon) {
      this.$icon.innerHTML = ''
      this.$icon.appendChild(icon)
    }
  }

  destroy() {
    this._clearAutoClose()
    if (this.parentElement) {
      this.parentElement.removeChild(this)
    }
  }

  _autoCloseTimer?: ReturnType<typeof setTimeout>
  _clearAutoClose() {
    clearTimeout(this._autoCloseTimer)
  }

  _setAutoClose() {
    if (this.duration && this.duration > 0) {
      this._clearAutoClose()
      this._autoCloseTimer = setTimeout(() => {
        this.close()
      }, this.duration * 1000)
    }
  }
}
