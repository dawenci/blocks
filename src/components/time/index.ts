import '../scrollable/index.js'
import type { EnumAttrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import { dispatchEvent } from '../../common/event.js'
import { scrollTo } from '../../common/scrollTo.js'
import { find, forEach, range } from '../../common/utils.js'
import {
  Component,
  ComponentEventListener,
  ComponentEventMap,
} from '../Component.js'
import { template } from './template.js'
import { style } from './style.js'
import { BlocksScrollable } from '../scrollable/index.js'

interface TimeEventMap extends ComponentEventMap {
  change: CustomEvent<{
    hour: number
    minute: number
    second: number
  }>
}

const mutableAttrs = ['hour', 'minute', 'second', 'size'] as const
type MutableAttrs = (typeof mutableAttrs)[number]

export interface BlocksTime extends Component {
  _ref: {
    $layout: HTMLElement
    $hours: BlocksScrollable
    $minutes: BlocksScrollable
    $seconds: BlocksScrollable
  }

  addEventListener<K extends keyof TimeEventMap>(
    type: K,
    listener: ComponentEventListener<TimeEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof TimeEventMap>(
    type: K,
    listener: ComponentEventListener<TimeEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-time',
  styles: [style],
})
export class BlocksTime extends Component {
  @attr('intRange', { min: 0, max: 23 }) accessor hour!: number | null

  @attr('intRange', { min: 0, max: 59 }) accessor minute!: number | null

  @attr('intRange', { min: 0, max: 59 }) accessor second!: number | null

  @attrs.size accessor size!: EnumAttrs['size']

  #scrollFlag?: Promise<void>
  #batchChange?: Promise<void>

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!

    shadowRoot.appendChild(template())

    const $layout = shadowRoot.getElementById('layout') as HTMLElement
    const $hours = shadowRoot.getElementById('hours') as BlocksScrollable
    const $minutes = shadowRoot.getElementById('minutes') as BlocksScrollable
    const $seconds = shadowRoot.getElementById('seconds') as BlocksScrollable

    this._ref = {
      $layout,
      $hours,
      $minutes,
      $seconds,
    }

    const handler = (prop: 'hour' | 'minute' | 'second') => {
      return (e: Event) => {
        const target = e.target as HTMLElement
        if (target.classList.contains('item')) {
          if (target.classList.contains('disabled')) return

          const value = +target.textContent!

          // 值没有变化，不会触发 attributeChangedCallback，
          // 因此人工执行动画
          if (value === this[prop]) {
            this.scrollToActive()
          }

          this[prop] = value
        }
      }
    }
    $hours.onclick = handler('hour')
    $minutes.onclick = handler('minute')
    $seconds.onclick = handler('second')
  }

  #disabledHour?: (
    data: number,
    context: {
      hour: number | null
      minute: number | null
      second: number | null
      component: BlocksTime
    }
  ) => boolean

  get disabledHour() {
    return this.#disabledHour
  }
  set disabledHour(value) {
    this.#disabledHour = value
    this.#renderDisabled()
  }

  #disabledMinute?: (
    data: number,
    context: {
      hour: number | null
      minute: number | null
      second: number | null
      component: BlocksTime
    }
  ) => boolean
  get disabledMinute() {
    return this.#disabledMinute
  }
  set disabledMinute(value) {
    this.#disabledMinute = value
    this.#renderDisabled()
  }

  #disabledSecond?: (
    data: number,
    context: {
      hour: number | null
      minute: number | null
      second: number | null
      component: BlocksTime
    }
  ) => boolean
  get disabledSecond() {
    return this.#disabledSecond
  }
  set disabledSecond(value) {
    this.#disabledSecond = value
    this.#renderDisabled()
  }

  get value(): [number, number, number] | null {
    if (this.hour == null || this.minute == null || this.second == null) {
      return null
    }
    return [this.hour, this.minute, this.second]
  }

  set value(value: [number, number, number] | null) {
    if (value == null) {
      this.hour = this.minute = this.second = null
      return
    }
    this.hour = value[0]
    this.minute = value[1]
    this.second = value[2]
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: MutableAttrs,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.upgradeProperty(['disabledHour', 'disabledMinute', 'disabledSecond'])

    if (['hour', 'minute', 'second'].includes(attrName)) {
      if (newValue === null) {
        forEach(this._ref.$layout.querySelectorAll('.active'), active => {
          active.classList.remove('active')
        })
        if (attrName !== 'hour' && this.hour !== null) this.hour = null
        if (attrName !== 'minute' && this.minute !== null) this.minute = null
        if (attrName !== 'second' && this.second !== null) this.second = null
        this.render()
      } else {
        const $list =
          this._ref[`$${attrName as Exclude<MutableAttrs, 'size'>}s`]

        const $old = $list.querySelector('.active')
        if ($old) {
          $old.classList.remove('active')
        }

        const $new = find(
          $list.children,
          $li => +$li.textContent! === +newValue
        )
        if ($new) {
          $new.classList.add('active')
        }

        if (attrName !== 'hour' && !this.hour && this.hour !== 0) this.hour = 0
        if (attrName !== 'minute' && !this.minute && this.minute !== 0)
          this.minute = 0
        if (attrName !== 'second' && !this.second && this.second !== 0)
          this.second = 0

        this.render()
      }

      this.scrollToActive()
      this.triggerChange()
    }
  }

  #renderDisabled() {
    const { $hours, $minutes, $seconds } = this._ref
    const ctx = {
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      component: this,
    }
    if (typeof this.disabledHour === 'function') {
      $hours.querySelectorAll('.item').forEach(($item, index) => {
        $item.classList.toggle('disabled', this.disabledHour!(index, ctx))
      })
    }
    if (typeof this.disabledMinute === 'function') {
      $minutes.querySelectorAll('.item').forEach(($item, index) => {
        $item.classList.toggle('disabled', this.disabledMinute!(index, ctx))
      })
    }
    if (typeof this.disabledSecond === 'function') {
      $seconds.querySelectorAll('.item').forEach(($item, index) => {
        $item.classList.toggle('disabled', this.disabledSecond!(index, ctx))
      })
    }
  }

  override render() {
    const { $hours, $minutes, $seconds } = this._ref
    if (!$hours.children.length) {
      range(0, 23).forEach(n => {
        const $item = $hours.appendChild(document.createElement('div'))
        $item.className = 'item'
        $item.textContent = n < 10 ? '0' + n : String(n)
      })
      const $bot = $hours.appendChild(document.createElement('div'))
      $bot.className = 'bot'
    }

    if (!$minutes.children.length) {
      range(0, 59).forEach(n => {
        const $item = $minutes.appendChild(document.createElement('div'))
        $item.className = 'item'
        $item.textContent = n < 10 ? '0' + n : String(n)
      })
      const $bot = $minutes.appendChild(document.createElement('div'))
      $bot.className = 'bot'
    }

    if (!$seconds.children.length) {
      range(0, 59).forEach(n => {
        const $item = $seconds.appendChild(document.createElement('div'))
        $item.className = 'item'
        $item.textContent = n < 10 ? '0' + n : String(n)
      })
      const $bot = $seconds.appendChild(document.createElement('div'))
      $bot.className = 'bot'
    }
    this.#renderDisabled()
  }

  clear() {
    this.hour = this.minute = this.second = null
    this.render()
  }

  _scrollToActive() {
    const { $layout, $hours, $minutes, $seconds } = this._ref
    if (this.hour == null && this.minute == null && this.second == null) {
      forEach([$hours, $minutes, $seconds], $panel => {
        scrollTo($panel, 0, { property: 'viewportScrollTop', duration: 0.16 })
      })
    } else {
      forEach(
        $layout.querySelectorAll('.active') as unknown as HTMLElement[],
        $active => {
          scrollTo($active.parentElement!, $active.offsetTop, {
            property: 'viewportScrollTop',
            duration: 0.16,
          })
        }
      )
    }
  }

  scrollToActive() {
    // 避免多个 h, m, s 同时设置的时候，触发多次
    if (!this.#scrollFlag) {
      this.#scrollFlag = Promise.resolve().then(() => {
        this._scrollToActive()
        this.#scrollFlag = undefined
      })
    }
  }

  triggerChange() {
    // 避免多个 h, m, s 同时设置的时候，触发多次
    if (!this.#batchChange) {
      this.#batchChange = Promise.resolve().then(() => {
        const detail = {
          hour: this.hour,
          minute: this.minute,
          second: this.second,
        }
        dispatchEvent(this, 'change', { detail })
        this.#batchChange = undefined
      })
    }
  }
}
