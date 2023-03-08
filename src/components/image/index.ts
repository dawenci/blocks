import '../loading/index.js'
import '../icon/index.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import type { NullableEnumAttr } from '../../decorators/attr.js'
import { strGetter, strSetter } from '../../common/property.js'
import { dispatchEvent } from '../../common/event.js'
import { makeMessages } from '../../i18n/makeMessages.js'
import { Component } from '../Component.js'

import {
  contentTemplate,
  fallbackTemplate,
  placeholderTemplate,
} from './template.js'
import { style } from './style.js'
import { domRef } from '../../decorators/domRef.js'

const getMessage = makeMessages('image', {
  placeholderText: '加载中',
  fallbackText: '加载失败',
})

export interface BlocksImage extends Component {
  _ref: {
    $placeholder?: HTMLElement
    $fallback?: HTMLElement
  }

  _status: 'init' | 'loading' | 'loaded' | 'error'
}

@defineClass({
  customElement: 'bl-image',
  styles: [style],
})
export class BlocksImage extends Component {
  @attr('string') accessor alt!: string | null

  @attr('string') accessor fallback!: string | null

  @attr('boolean') accessor manual!: boolean

  @attr('string') accessor placeholder!: string | null

  @attr('string') accessor src!: string | null

  @attr('enum', {
    enumValues: ['none', 'fill', 'contain', 'cover', 'scale-down'],
  })
  accessor fit!: NullableEnumAttr<
    ['none', 'fill', 'contain', 'cover', 'scale-down']
  >

  @domRef('#layout') accessor $layout!: HTMLElement

  @domRef('#img') accessor $img!: HTMLImageElement

  constructor() {
    super()

    this.shadowRoot!.appendChild(contentTemplate())
    this._ref = {} as any

    const { $img } = this

    this._status = 'init'
    $img.addEventListener('load', () => {
      if (this._status === 'loading') {
        this._status = 'loaded'
        this._renderSuccess()
        dispatchEvent(this, 'loaded')
      }
    })

    $img.addEventListener('error', () => {
      if (this._status === 'loading') {
        this._status = 'error'
        this._renderFail()
        dispatchEvent(this, 'error')
      }
    })
  }

  _renderLoading() {
    const { $layout, $img } = this
    $img.style.opacity = '0'
    this._removeFallback()

    if (!this._ref.$placeholder) {
      this._ref.$placeholder = $layout.appendChild(placeholderTemplate())
      this._ref.$placeholder.querySelector('.placeholderText')!.textContent =
        getMessage('placeholderText')

      if (this.placeholder) {
        this._ref.$placeholder.querySelector('img')!.src = this.placeholder
      }
    }
  }

  _renderFail() {
    const { $layout, $img } = this
    $img.style.opacity = '0'
    this._removePlaceholder()

    if (!this._ref.$fallback) {
      this._ref.$fallback = $layout.appendChild(fallbackTemplate())
      this._ref.$fallback.querySelector('.fallbackText')!.textContent =
        getMessage('fallbackText')

      if (this.fallback) {
        this._ref.$fallback.querySelector('img')!.src = this.fallback
      }
    }
  }

  _renderSuccess() {
    this.$img.style.opacity = '1'
    this._removePlaceholder()
    this._removeFallback()

    if (this.fit) {
      this.$img.style.objectFit = this.fit
    }
  }

  _removePlaceholder() {
    if (this._ref.$placeholder) {
      this.$layout.removeChild(this._ref.$placeholder)
      this._ref.$placeholder = undefined
    }
  }

  _removeFallback() {
    if (this._ref.$fallback) {
      this.$layout.removeChild(this._ref.$fallback)
      this._ref.$fallback = undefined
    }
  }

  _reset() {
    const { $img } = this
    this._status = 'init'
    $img.style.display = 'none'
    $img.style.opacity = '0'
    $img.src = ''
    $img.style.display = ''
    this._removePlaceholder()
    this._removeFallback()
  }

  override render() {
    if (this.$img.getAttribute('alt') !== this.alt) {
      strSetter('alt')(this.$img, this.alt)
    }

    switch (this._status) {
      case 'loading':
        return this._renderLoading()
      case 'error':
        return this._renderFail()
      case 'loaded':
        return this._renderSuccess()
    }
  }

  load() {
    if (
      this._status === 'loading' ||
      (strGetter('alt')(this.$img) === this.src && this._status === 'loaded')
    ) {
      return
    }
    this._status = 'loading'
    this.$img.src = this.src!
    this._renderLoading()
    dispatchEvent(this, 'loading')
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
    if (!this.manual) {
      this.load()
    }
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'src') {
      if (!this.manual) {
        this.load()
      } else {
        this._reset()
      }
    } else {
      this.render()
    }
  }
}
