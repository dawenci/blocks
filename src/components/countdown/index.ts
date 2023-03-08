import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'
import { template } from './template.js'
import { style } from './style.js'
import { padLeft } from '../../common/utils.js'
import { dispatchEvent } from '../../common/event.js'
import { parseDateFormat, Token } from './parseDateFormat.js'
import {
  Component,
  ComponentEventListener,
  ComponentEventMap,
} from '../Component.js'

interface CountDownEventMap extends ComponentEventMap {
  start: CustomEvent<void>
  stop: CustomEvent<void>
  finish: CustomEvent<void>
}

export interface BlocksCountdown extends Component {
  _ref: {
    $layout: HTMLElement
  }

  addEventListener<K extends keyof CountDownEventMap>(
    type: K,
    listener: ComponentEventListener<CountDownEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof CountDownEventMap>(
    type: K,
    listener: ComponentEventListener<CountDownEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-countdown',
  styles: [style],
})
export class BlocksCountdown extends Component {
  // timestamp
  @attr('number', { defaults: () => Date.now() })
  accessor value!: number

  @attr('string')
  accessor format = 'H:mm:ss'

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())
    this._ref = {
      $layout: shadowRoot.querySelector('#layout') as HTMLDivElement,
    }
  }

  // 根据当前显示的最小值，决定计时的调整值
  // 考虑下场景:
  // 格式化最小显示的单位是秒时（即不显示毫秒），倒计时到不足一秒（但是还有999毫秒），
  // 此时会显示一个 0，但是 finish 事件还没触发，还要接近一秒才触发
  // 因此，要根据当前格式化最小单位是什么，为这个单位加上一个修正值，倒计时到最后的时候
  // 显示 1 而不是 0, 显示 0 的时候，就真正 finish
  #getOffsetByFormat() {
    const { format } = this
    return format.includes('SSS')
      ? 0
      : format.includes('s')
      ? 999
      : format.includes('m')
      ? 59999
      : format.includes('H')
      ? 3599999
      : format.includes('D')
      ? 86399999
      : 0
  }

  override render() {
    const { format, value: deadline } = this
    let day = 0
    let hour = 0
    let minute = 0
    let second = 0
    let millisecond = deadline! - Date.now() + this.#getOffsetByFormat()
    if (millisecond >= 0) {
      if (format.includes('D')) {
        day = Math.floor(millisecond / 86400000)
        millisecond %= 86400000
      }
      if (format.includes('H')) {
        hour = Math.floor(millisecond / 3600000)
        millisecond %= 3600000
      }
      if (format.includes('m')) {
        minute = Math.floor(millisecond / 60000)
        millisecond %= 60000
      }
      if (format.includes('s')) {
        second = Math.floor(millisecond / 1000)
        millisecond %= 1000
      }
    } else {
      millisecond = 0
    }

    patchDom(this._ref.$layout, parseDateFormat(this.format), {
      day,
      hour,
      minute,
      second,
      millisecond,
    })
  }

  #running = false
  #rAFId?: number
  #timerId?: number
  run() {
    if (this.value - Date.now() <= 0) {
      return
    }
    const tick = () => {
      if (this.value - Date.now() <= 0) {
        // 计时结束，刷新界面
        this.render()
        // 在绘制完 UI 再触发 end，以便 end 事件处理器可以访问到最新的 UI
        requestAnimationFrame(() => {
          dispatchEvent(this, 'finish')
        })
        // 自动停止
        this.stop()
      } else {
        // 在 rAF 中更新并递归
        this.#rAFId = requestAnimationFrame(() => {
          this.render()
          tick()
        })
      }
    }

    if (!this.#running) {
      dispatchEvent(this, 'start')
      this.#running = true
      tick()
      // 兜底
      this.#timerId = setTimeout(tick, this.value - Date.now())
    }
  }

  stop() {
    this.#running = false
    if (this.#rAFId) {
      // 刷新界面
      this.render()
      // 以便 stop 事件处理器可以访问到正确的 UI
      requestAnimationFrame(() => {
        dispatchEvent(this, 'stop')
      })
      cancelAnimationFrame(this.#rAFId)
      this.#rAFId = undefined
      clearTimeout(this.#timerId)
      this.#timerId = undefined
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.run()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this.stop()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    if (attrName === 'value') {
      this.run()
    } else {
      this.render()
    }
  }
}

type VarName = 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
function patchDom(
  dom: HTMLElement,
  tokens: Token[],
  vars: Record<VarName, number | string>
) {
  // 内容没更新
  if (dom.textContent === tokens.map(token => token.payload).join('')) return

  // 生成（优先重用） DOM 渲染
  const children = dom.children
  if (children.length > tokens.length) {
    let len = children.length - tokens.length
    while (len--) {
      dom.removeChild(dom.lastElementChild!)
    }
  }
  tokens.forEach((token, index) => {
    const { type, payload } = token
    let text
    switch (type) {
      case 'day':
      case 'hour':
      case 'minute':
      case 'second': {
        const value = String(vars[type]) ?? ''
        text = payload.length === 2 ? padLeft('0', 2, value) : value
        break
      }
      case 'millisecond': {
        const value = String(vars[type]) ?? ''
        text = padLeft('0', 3, value)
        break
      }
      // text
      default:
        text = payload
        break
    }

    const el =
      children[index] ?? dom.appendChild(document.createElement('span'))
    el.setAttribute('part', type)
    el.textContent = text
  })
}
