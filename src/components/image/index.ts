import '../loading/index.js'
import '../icon/index.js'
import { attr } from '../../decorators/attr/index.js'
import { contentTemplate, fallbackTemplate, placeholderTemplate } from './template.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { makeMessages } from '../../i18n/makeMessages.js'
import { strGetter, strSetter } from '../../common/property.js'
import { style } from './style.js'
import { BlComponent } from '../component/Component.js'

const getMessage = makeMessages('image', {
  placeholderText: '加载中',
  fallbackText: '加载失败',
})

export interface BlImage extends BlComponent {
  _status: 'init' | 'loading' | 'loaded' | 'error'
}

@defineClass({
  customElement: 'bl-image',
  styles: [style],
})
export class BlImage extends BlComponent {
  static override get role() {
    return 'img'
  }

  @attr('string') accessor alt!: string | null

  @attr('string') accessor fallback!: string | null

  @attr('boolean') accessor manual!: boolean

  @attr('string') accessor placeholder!: string | null

  @attr('string') accessor src!: string | null

  @attr('enum', {
    enumValues: ['none', 'fill', 'contain', 'cover', 'scale-down'],
  })
  accessor fit!:  MaybeOneOf<['none', 'fill', 'contain', 'cover', 'scale-down']>

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('[part="img"]') accessor $img!: HTMLImageElement
  @shadowRef('[part="placeholder"]', false) accessor $placeholder!: HTMLElement | null
  @shadowRef('[part="fallback"]', false) accessor $fallback!: HTMLElement | null

  constructor() {
    super()

    this.appendShadowChild(contentTemplate())

    this.#setupLoad()

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)
  }

  #setupLoad() {
    this._status = 'init'
    const onLoad = () => {
      if (this._status === 'loading') {
        this._status = 'loaded'
        this._renderSuccess()
        dispatchEvent(this, 'loaded')
      }
    }
    const onError = () => {
      if (this._status === 'loading') {
        this._status = 'error'
        this._renderFail()
        dispatchEvent(this, 'error')
      }
    }
    this.hook.onConnected(() => {
      this.$img.addEventListener('load', onLoad)
      this.$img.addEventListener('error', onError)
      if (!this.manual) {
        this.load()
      }
    })
    this.hook.onDisconnected(() => {
      this.$img.removeEventListener('load', onLoad)
      this.$img.removeEventListener('error', onError)
    })
    this.hook.onAttributeChangedDep('src', () => {
      if (!this.manual) {
        this.load()
      } else {
        this._reset()
      }
    })
  }

  _renderLoading() {
    const { $layout, $img } = this
    $img.style.opacity = '0'
    this._removeFallback()

    if (!this.$placeholder) {
      const $placeholder = $layout.appendChild(placeholderTemplate())
      $placeholder.querySelector('.placeholderText')!.textContent = getMessage('placeholderText')

      if (this.placeholder) {
        $placeholder.querySelector('img')!.src = this.placeholder
      }
    }
  }

  _renderFail() {
    const { $layout, $img } = this
    $img.style.opacity = '0'
    this._removePlaceholder()

    if (!this.$fallback) {
      const $fallback = $layout.appendChild(fallbackTemplate())
      $fallback.querySelector('.fallbackText')!.textContent = getMessage('fallbackText')

      if (this.fallback) {
        $fallback.querySelector('img')!.src = this.fallback
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
    if (this.$placeholder) {
      this.$layout.removeChild(this.$placeholder)
    }
  }

  _removeFallback() {
    if (this.$fallback) {
      this.$layout.removeChild(this.$fallback)
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
    super.render()
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
    if (this._status === 'loading' || (strGetter('alt')(this.$img) === this.src && this._status === 'loaded')) {
      return
    }
    this._status = 'loading'
    this.$img.src = this.src!
    this._renderLoading()
    dispatchEvent(this, 'loading')
  }
}
