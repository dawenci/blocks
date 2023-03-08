import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import type { NullableEnumAttr } from '../../decorators/attr.js'
import { dispatchEvent } from '../../common/event.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { boolSetter, enumSetter, intSetter } from '../../common/property.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { style } from './style.js'

const closeableSetter = boolSetter('closeable')
const typeSetter = enumSetter('type', [
  'message',
  'success',
  'error',
  'info',
  'warning',
])

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
  accessor type!: NullableEnumAttr<
    ['message', 'success', 'error', 'info', 'warning']
  >

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

    $layout.onmouseenter = () => {
      this._clearAutoClose()
    }

    $layout.onmouseleave = () => {
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
    const iconName = this.type === 'warning' ? 'info' : this.type || ''
    const icon = getRegisteredSvgIcon(iconName)
    if (icon) {
      this._ref.$icon.innerHTML = ''
      this._ref.$icon.appendChild(icon)
    }

    if (this.closeable) {
      if (!this._ref.$close) {
        this._ref.$close = this._ref.$layout.appendChild(
          document.createElement('button')
        )
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

  override connectedCallback() {
    super.connectedCallback()
    this.render()
    this._setAutoClose()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.render()

    if (attrName === 'duration' && this.duration) {
      this._setAutoClose()
    }
  }

  _autoCloseTimer?: number
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

function cage() {
  let cage = document.querySelector('.bl-message-cage') as HTMLElement
  if (!cage) {
    cage = document.body.appendChild(document.createElement('div'))
    cage.className = `bl-message-cage`
    const cssText =
      'pointer-events:none;overflow:hidden;position:fixed;z-index:100;top:0;bottom:auto;left:0;right:0;display:flex;flex-flow:column nowrap;justify-content:center;align-items:center;padding:8px 0;'
    cage.style.cssText = cssText
  }
  return cage
}

export interface MessageOptions {
  type?: any
  closeable?: boolean
  duration?: number
  content?: string
}

export function blMessage(options: MessageOptions = {}) {
  const el = document.createElement('bl-message')
  typeSetter(el, options.type)
  closeableSetter(el, options.closeable ?? false)
  if (options.duration != null) intSetter('duration')(el, options.duration)

  const content = options.content

  el.innerHTML = content ?? ''
  el.style.cssText = `transform:translate(0, -100%);opacity:0;`

  cage().appendChild(el)

  el.offsetHeight
  el.style.cssText = `transform:translate(0, 0);opacity:1;`

  let closedCallback: () => void
  let closed = false
  const onClosed = () => {
    closed = true
    if (closedCallback) closedCallback()
    el.removeEventListener('closed', onClosed)
  }
  el.addEventListener('closed', onClosed)

  return {
    el,
    close() {
      el.close()
      return this
    },
    onclose(callback: () => void) {
      if (closed) {
        callback()
      } else {
        closedCallback = callback
      }
      return this
    },
  }
}
