import type { BlComponentEventMap, BlComponentEventListener } from '../component/Component.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { prop } from '../../decorators/prop/index.js'
import { template } from './template.js'
import { BlComponent } from '../component/Component.js'

export interface BlIntersectionEventMap extends BlComponentEventMap {
  intersection: CustomEvent<{
    entries: IntersectionObserverEntry[]
    observer: IntersectionObserver
  }>
}

export interface BlIntersection extends BlComponent {
  addEventListener<K extends keyof BlIntersectionEventMap>(
    type: K,
    listener: BlComponentEventListener<BlIntersectionEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlIntersectionEventMap>(
    type: K,
    listener: BlComponentEventListener<BlIntersectionEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-intersection',
})
export class BlIntersection extends BlComponent {
  static override get observedAttributes() {
    return ['root']
  }

  @attr('string') accessor rootMargin = '0px'

  @attr('string') accessor rootSelector!: string | null

  @attr('number') accessor threshold = 0

  #rootElement?: () => HTMLElement
  /** 锚定元素访问器 */
  @prop({
    get(self) {
      return self.#rootElement
    },
    set(self, value: (() => HTMLElement) | undefined) {
      self.#rootElement = value
      self.updatePositionAndDirection()
    },
  })
  accessor rootElement!: (() => Element) | undefined

  constructor() {
    super()

    this.appendShadowChild(template())

    this.hook.onConnected(() => {
      this.render()
      this._initObserver()
    })

    this.hook.onDisconnected(() => {
      this._removeObserver()
    })

    this.hook.onAttributeChanged(() => {
      this._initObserver()
    })
  }

  _getRootElement() {
    if (this.rootElement) {
      return this.rootElement() ?? null
    }
    if (this.rootSelector) {
      return document.querySelector(this.rootSelector)
    }
    return null
  }

  _flag?: any
  _observer?: any
  _initObserver() {
    // 避免多个属性变化触发多次
    if (!this._flag) {
      this._flag = Promise.resolve().then(() => {
        if (this._observer) {
          this._observer.disconnect()
        }

        const root = this._getRootElement()
        this._observer = new IntersectionObserver(
          (entries, observer) => {
            dispatchEvent(this, 'intersection', {
              detail: {
                entries,
                observer,
              },
            })
          },
          {
            root,
            rootMargin: this.rootMargin,
            threshold: +this.threshold,
          }
        )
        this._observer.observe(this)

        this._flag = null
      })
    }
  }

  _removeObserver() {
    if (this._observer) {
      this._observer.disconnect()
    }
  }
}
