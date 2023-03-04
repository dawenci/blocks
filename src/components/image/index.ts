import '../loading/index.js'
import '../icon/index.js'
import { strGetter, strSetter } from '../../common/property.js'
import { dispatchEvent } from '../../common/event.js'
import { makeMessages } from '../../i18n/makeMessages.js'
import { Component } from '../Component.js'
import {
  contentTemplate,
  fallbackTemplate,
  placeholderTemplate,
  styleTemplate,
} from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'
import type { NullableEnumAttr } from '../../decorators/attr.js'

const getMessage = makeMessages('image', {
  placeholderText: '加载中',
  fallbackText: '加载失败',
})

export interface BlocksImage extends Component {
  _ref: {
    $layout: HTMLElement
    $img: HTMLImageElement
    $placeholder?: HTMLElement
    $fallback?: HTMLElement
  }

  _status: 'init' | 'loading' | 'loaded' | 'error'
}

@customElement('bl-image')
export class BlocksImage extends Component {
  static override get observedAttributes() {
    return ['alt', 'fallback', 'fit', 'manual', 'placeholder', 'src'] as const
  }

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

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const $style = styleTemplate()
    const $layout = contentTemplate()
    const $img = $layout.querySelector('#img') as HTMLImageElement
    this.appendShadowChildren([$style, $layout])

    this._ref = {
      $layout,
      $img,
    }

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
    const { $layout, $img } = this._ref
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
    const { $layout, $img } = this._ref
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
    this._ref.$img.style.opacity = '1'
    this._removePlaceholder()
    this._removeFallback()

    if (this.fit) {
      this._ref.$img.style.objectFit = this.fit
    }
  }

  _removePlaceholder() {
    if (this._ref.$placeholder) {
      this._ref.$layout.removeChild(this._ref.$placeholder)
      this._ref.$placeholder = undefined
    }
  }

  _removeFallback() {
    if (this._ref.$fallback) {
      this._ref.$layout.removeChild(this._ref.$fallback)
      this._ref.$fallback = undefined
    }
  }

  _reset() {
    const { $img } = this._ref
    this._status = 'init'
    $img.style.display = 'none'
    $img.style.opacity = '0'
    $img.src = ''
    $img.style.display = ''
    this._removePlaceholder()
    this._removeFallback()
  }

  override render() {
    if (this._ref.$img.getAttribute('alt') !== this.alt) {
      strSetter('alt')(this._ref.$img, this.alt)
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
      (strGetter('alt')(this._ref.$img) === this.src &&
        this._status === 'loaded')
    ) {
      return
    }
    this._status = 'loading'
    this._ref.$img.src = this.src!
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
