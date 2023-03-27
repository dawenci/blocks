import type { NullableEnumAttr } from '../../decorators/attr.js'
import { attr } from '../../decorators/attr.js'

import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'

export interface BlocksMessage extends Component {
  _ref: {
    $layout: HTMLElement
    $icon: HTMLElement
    $content: HTMLElement
    $close?: HTMLButtonElement
  }
}

@defineClass({
  customElement: 'bl-message',
  styles: [style],
})
export class BlocksMessage extends Component {
  @attr('boolean') accessor closeable!: boolean

  @attr('number') accessor duration = 10

  @attr('enum', {
    enumValues: ['message', 'success', 'error', 'info', 'warning'],
  })
  accessor type!: NullableEnumAttr<['message', 'success', 'error', 'info', 'warning']>

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())
    const $layout = shadowRoot.querySelector('#layout') as HTMLElement
    const $icon = shadowRoot.querySelector('#icon') as HTMLElement
    const $content = shadowRoot.querySelector('#content') as HTMLElement

    this._ref = {
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

    this._ref.$layout.onmouseenter = () => {
      this._clearAutoClose()
    }

    this._ref.$layout.onmouseleave = () => {
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
      this._ref.$icon.innerHTML = ''
      this._ref.$icon.appendChild(icon)
    }

    if (this.closeable) {
      if (!this._ref.$close) {
        this._ref.$close = this._ref.$layout.appendChild(document.createElement('button'))
        this._ref.$close.id = 'close'
        this._ref.$close.appendChild(getRegisteredSvgIcon('cross')!)
        this._ref.$close.onclick = () => {
          this.close()
        }
      }
    } else {
      if (this._ref.$close) {
        this._ref.$close.parentElement!.removeChild(this._ref.$close)
        this._ref.$close = undefined
      }
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
