import './optgroup.js'
import './option.js'

import {
  $radiusBase
} from '../theme/var.js'

import '../popup/index.js'
import '../input/index.js'
import '../theme/svg/up.svg.js'
import '../theme/svg/down.svg.js'

let idSeed = Date.now()

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host(:focus) {
  outline: 0 none;
}
:host {
  display: inline-block;
  height: 32px;
  user-select: none;
  cursor: default;
}
</style>`

const TEMPLATE_HTML = `
<blocks-input suffix-icon="down" class="date-picker-input" readonly></blocks-input>
<blocks-popup class="date-picker-popup" origin="top-start" arrow>
  <div class="option-list" style="overflow:hidden;border-radius:${$radiusBase};"></div>
</blocks-popup>
<slot style="display:none;"></slot>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksSelect extends HTMLElement {
  static get observedAttributes() {
    return [
      'depth',
      'mindepth',
      'startdepth',
      'disableMethod',
      'multiple',
      'max',
      'loading',
      'clearable',
      'startWeekOn',
    ]
  }

  constructor() {
    super()

    this.attachShadow({
      mode: 'open',
      // 代理焦点，
      // 1. 点击 shadow DOM 内某个不可聚焦的区域，则第一个可聚焦区域将成为焦点
      // 2. 当 shadow DOM 内的节点获得焦点时，除了聚焦的元素外，:focus 还会应用到宿主
      // 3. 自己的 slot 中的元素聚焦，宿主不会获得焦点，但是 :focus-within 生效
      delegatesFocus: true
    })

    const fragment = template.content.cloneNode(true)
    this.input = fragment.querySelector('blocks-input')
    this.popup = fragment.querySelector('.date-picker-popup')
    this.list = fragment.querySelector('.option-list')
    this.optionSlot = fragment.querySelector('slot')
    this.shadowRoot.appendChild(fragment)
    this.id = `select-${idSeed++}`
    this.popup.setAttribute('anchor', `#${this.id}`)

    this.input.onfocus = this.input.onfocus = e => {
      this.popup.style.minWidth = `${this.input.offsetWidth}px`
      this.popup.open = true
      this.input.suffixIcon = 'up'
    }

    this.input.addEventListener('click-clear', e => {
      this.value = null
    })

    this.list.addEventListener('click', e => {
      const target = e.target
      if (target.tagName === 'BLOCKS-OPTION') {
        if (target.disabled) return
        if (target.parentElement.tagName === 'BLOCKS-OPTGROUP' && target.parentElement.disabled) return
        const option = {
          value: target.value,
          label: target.label,
          text: target.textContent,
        }
        this.select(option)
        if (!this.multiple) {
          this.popup.open = false
          this.input.suffixIcon = 'down'
        }
      }
      this.render()
    })    
  }

  select({ value, label, text }) {
    this.value = value
    this.text = label || text || value
    this.list.querySelectorAll('blocks-option')
      .forEach(el => {
        el.selected = el.value === value
      })
  }

  render() {
  }

  get options() {
    return this.list.querySelectorAll('blocks-option')
  }

  get text() {
    return this.input.value
  }

  set text(value) {
    this.input.value = value
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(value) {
    let selected
    this.options.forEach(el => {
      el.selected = el.value === value
      if (!selected && el.selected) selected = el
    })

    if (selected) {
      this.setAttribute('value', value)
      this.text = selected.label || selected.textContent
    }
    else {
      this.removeAttribute('value')
      this.text = ''
    }
  }

  get clearable() {
    return this.input.clearable
  }

  set clearable(value) {
    this.input.clearable = value
  }

  get max() {
    return parseInt(this.getAttribute('max')) || 0
  }

  set max(value) {
    this.setAttribute('max', value)
  }

  get multiple() {
    return this.getAttribute('multiple')
  }

  set multiple(value) {
    this.setAttribute('multiple', value)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      this._upgradeProperty(attr)
    })
    this.render()

    if (!this._onClickOutside) {
      this._onClickOutside = (e) => {
        if (this.popup.open && !this.contains(e.target) && !this.popup.contains(e.target)) {
          this.popup.open = false
          this.input.suffixIcon = 'down'
        }
      }
    }

    document.addEventListener('click', this._onClickOutside)

    this.optionSlot.addEventListener('slotchange', e => {
      this.renderOptions()
    })
  }

  renderOptions() {
    this.list.innerHTML = ''

    const isOption = el => el instanceof customElements.get('blocks-option')
    const isGroup = el => el instanceof customElements.get('blocks-optgroup')

    // 将 slot 传入的 option 等拷贝到 popup 里
    this.optionSlot.assignedElements()
      .forEach(el => {
        if (isOption(el) || isGroup(el)) {
          const copy = el.cloneNode(true)
          if (copy.id) delete copy.id
          this.list.appendChild(copy)
          if (isOption(el)) {

          }
        }
      })
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onClickOutside)
  }

  // adoptedCallback() {
  // }

  attributeChangedCallback(name, oldValue, newValue) {
    if (['clearable'].includes(name)) {
      this.input.setAttribute(name, newValue)
    }
    this.render()
  }

  _focus() {
    if (this.restorefocus && !this._prevFocus) {
      this._prevFocus = document.activeElement
    }
    this.popup.focus()
  }

  _blur() {
    this.popup.blur()
    if (this._prevFocus) {
      if (this.restorefocus && typeof this._prevFocus.focus) {
        this._prevFocus.focus()
      }
      this._prevFocus = undefined
    }
  }

  // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
  // 属性可能在 prototype 还没有链接到该实例前就设置了，
  // 在用户使用一些框架加载组件时，可能回出现这种情况，
  // 因此需要进行属性升级，确保 setter 逻辑能工作，
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop]
      delete this[prop]
      this[prop] = value
    }
  }
}

if (!customElements.get('blocks-select')) {
  customElements.define('blocks-select', BlocksSelect)
}
