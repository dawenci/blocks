import { padLeft } from '../../common/utils.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { numGetter, numSetter } from '../../common/property.js'

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout"></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksCountdown extends HTMLElement {
  static get observedAttributes() {
    return ['format', 'value']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.querySelector('#layout')
  }

  // timestamp
  get value() {
    return numGetter('value')(this)
  }

  set value(value) {
    numSetter('value')(this, value)
  }

  get format() {
    return this.getAttribute('format') || 'YYYY:MM:DD'
  }

  set format(value) {
    this.setAttribute('format', value)
  }

  get shouldShowDay() {
    return this.format.includes('DD') || this.format.includes('D')
  }

  get shouldShowHour() {
    return this.format.includes('HH') || this.format.includes('H')
  }

  get shouldShowMinute() {
    return this.format.includes('mm') || this.format.includes('m')
  }

  get shouldShowSecond() {
    return this.format.includes('ss') || this.format.includes('s')
  }

  get shouldShowMs() {
    return this.format.includes('SSS')
  }

  padHour(h) {
    return this.format.includes('HH') ? padLeft('0', 2, h) : h
  }

  padMin(m) {
    return this.format.includes('mm') ? padLeft('0', 2, m) : m
  }

  padSec(s) {
    return this.format.includes('ss') ? padLeft('0', 2, s) : s
  }

  render() {
    const deadline = this.value
    const now = Date.now()
    let d = 0
    let h = 0
    let m = 0
    let s = 0
    let ms = deadline - now
    if (ms >= 0) {
      if (this.shouldShowDay) {
        d = Math.floor(ms / 86400000)
        ms %= 86400000
      }
      if (this.shouldShowHour) {
        h = Math.floor(ms / 3600000)
        ms %= 3600000
      }
      if (this.shouldShowMinute) {
        m = Math.floor(ms / 60000)
        ms %= 60000
      }
      if (this.shouldShowSecond) {
        s = Math.floor(ms / 1000)
        ms %= 1000
      }
    }
    else {
      this.dispatchEvent(new CustomEvent('finish', { bubbles: true, composed: true, cancelable: true }))
    }

    const parseFormat = (str) => {
      const parts = []

      const len = str.length
      let i = 0
      let text = ''

      const makePart = (text, klass) => ({ text, klass })

      const pushText = () => {
        if (text) {
          parts.push(makePart(text, 'text'))
          text = ''
        }
      }

      let hasDay
      let hasHour
      let hasMinute
      let hasSecond
      let hasMillisecond
      const eatDay = () => {
        pushText()
        parts.push(makePart(d, 'day'))
        i += 1
      }

      // 时分秒支持前导 0
      const eatHMS = (klass) => {
        pushText()
        const char = klass === 'hour' ? 'H' : klass === 'minute' ? 'm' : 's'
        const value = klass === 'hour' ? h : klass === 'minute' ? m : s
        if (str[i + 1] === char) {
          parts.push(makePart(padLeft('0', 2, value), klass))
          i += 2
        }
        else {
          parts.push(makePart(value, klass))
          i += 1
        }
      }

      const eatMs = () => {
        pushText()
        parts.push(makePart(ms, 'millisecond'))
        i += 3
      }

      const eatText = () => {
        text += str[i]
        i += 1
      }

      while (i < len) {
        const ch = str[i]
        if (ch === 'D' && !hasDay) {
          hasDay = true
          eatDay()
        }
        else if (ch === 'H' && !hasHour) {
          hasHour = true
          eatHMS('hour')
        }
        else if (ch === 'm' && !hasMinute) {
          hasMinute = true
          eatHMS('minute')
        }
        else if (ch === 's' && !hasSecond) {
          hasSecond = true
          eatHMS('second')
        }
        else if (str.substr(i, 3) === 'SSS' && !hasMillisecond) {
          hasMillisecond = true
          eatMs('millisecond')
        }
        else {
          eatText()
        }
      }
      pushText()
      return parts
    }

    const parts = parseFormat(this.format)

    // 内容没更新
    if (this.$layout.textContent === parts.map(part => part.text).join('')) return

    // 生成（优先重用） DOM 渲染
    const children = this.$layout.children
    if (children.length > parts.length) {
      let len = children.length - parts.length
      while (len--) this.$layout.removeChild(this.$layout.lastElementChild)
    }
    parts.forEach((part, index) => {
      let el = children[index] ?? this.$layout.appendChild(document.createElement('span'))
      el.setAttribute('part', part.klass)
      el.textContent = part.text
    })
  }

  _loop() {
    this._timer = requestAnimationFrame(() => {
      this.render()
      this._loop()
    })
  }

  _stopLoop() {
    cancelAnimationFrame(this._timer)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this._loop()
  }

  disconnectedCallback() {
    this._stopLoop()
  }

  adoptedCallback() { }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
  }
}

if (!customElements.get('blocks-countdown')) {
  customElements.define('blocks-countdown', BlocksCountdown)
}
