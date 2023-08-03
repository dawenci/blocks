import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { fromAttr } from '../component/reactive.js'
import { scrollTo } from '../../common/scrollTo.js'
import { style } from './style.js'
import { strSetter } from '../../common/property.js'
import { template } from './template.js'
import { BlComponent } from '../component/Component.js'
import { computed, reactive, subscribe, unsubscribe } from '../../common/reactive.js'

@defineClass({
  customElement: 'bl-backtop',
  styles: [style],
})
export class BlBackTop extends BlComponent {
  static override get role() {
    return 'button'
  }

  @attr('number') accessor duration = 0

  @attr('number') accessor threshold = 400

  #scrolled = reactive(0)

  visible = computed((scrolled, threshold) => scrolled >= threshold, [this.#scrolled, fromAttr(this, 'threshold')])

  constructor() {
    super()
    this.appendShadowChild(template())

    this.#setupTarget()
    this.#setupButton()
  }

  #target?: () => Node
  get target(): string | Node | null {
    if (this.#target) {
      return this.#target() ?? null
    }
    return this.getAttribute('target')
  }

  set target(value: string | null | Node | (() => Node)) {
    if (typeof value === 'string' || value === null) {
      strSetter('target')(this, value)
      this.#target = undefined
      return
    }
    if (typeof value === 'function') {
      this.#target = value
    } else if (value instanceof Node) {
      this.#target = () => value
    }
    this.removeAttribute('target')
  }

  get targetElement(): Element | Window {
    const target = this.target
    if (target === null) {
      return window
    }
    if (target instanceof Element) {
      return target
    }
    if (typeof target === 'string') {
      try {
        return document.querySelector(target) ?? window
      } catch (error) {
        return window
      }
    }
    return window
  }

  #setupButton() {
    const render = () => {
      this.style.display = this.visible.content ? '' : 'none'
    }
    const onClick = () => {
      scrollTo(this.targetElement as HTMLElement, 0, {
        duration: this.duration,
        done: render,
      })
    }
    this.hook.onConnected(() => {
      this.addEventListener('click', onClick)
      subscribe(this.visible, render)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('click', onClick)
      unsubscribe(this.visible, render)
    })
    this.hook.onRender(render)
    this.hook.onConnected(render)
  }

  #setupTarget() {
    const scrollEventOptions = {
      capture: true,
      passive: true,
    }
    const onTargetScroll = (e: Event) => {
      if (e.target === this.targetElement) {
        this.#scrolled.content = (this.targetElement as any).scrollTop
      }
    }
    this.hook.onConnected(() => {
      document.addEventListener('scroll', onTargetScroll, scrollEventOptions)
    })
    this.hook.onDisconnected(() => {
      document.removeEventListener('scroll', onTargetScroll, scrollEventOptions)
    })
  }
}
