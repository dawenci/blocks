import { scrollTo } from '../../common/scrollTo.js'
import { Component } from '../Component.js'
import { make as makeModel } from './model.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { template } from './template.js'
import { style } from './style.js'
import { strSetter } from '../../common/property.js'

@defineClass({
  customElement: 'bl-backtop',
  styles: [style],
})
export class BlocksBackTop extends Component {
  #clearup?: () => void
  #target?: () => Node
  _model = makeModel()

  @attr('number')
  accessor duration = 0

  @attr('number')
  accessor threshold = 400

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

    this.addEventListener('click', () => {
      scrollTo(this.targetElement as HTMLElement, 0, {
        duration: this._model.get('duration'),
        done: () => this.render(),
      })
    })

    this._model.on('update:visible', this.render, this)
  }

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

  override render() {
    const scrollTop = this._model.get('scrolled')
    if (scrollTop >= this.threshold) {
      this.style.display = ''
    } else {
      this.style.display = 'none'
    }
  }

  override connectedCallback() {
    super.connectedCallback()

    this.render()

    const onTargetScroll = (e: Event) => {
      if (e.target === this.targetElement) {
        this._model.set('scrolled', (this.targetElement as any).scrollTop)
      }
    }
    const scrollEventOptions = {
      capture: true,
      passive: true,
    }
    document.addEventListener('scroll', onTargetScroll, scrollEventOptions)
    this.#clearup = () => {
      document.removeEventListener('scroll', onTargetScroll, scrollEventOptions)
    }
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void {
    super.attributeChangedCallback(attrName, oldValue, newValue)

    if (attrName === 'duration') {
      this._model.set('duration', this.duration)
    }
    if (attrName === 'threshold') {
      this._model.set('threshold', this.threshold)
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback()

    if (this.#clearup) {
      this.#clearup()
    }
  }
}
