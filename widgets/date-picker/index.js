import {} from '../theme/var.js'
import '../popup/index.js'
import '../input/index.js'
import '../date-panel/index.js'

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
<blocks-input suffix-icon="date" class="date-picker-input" readonly />
<blocks-popup append-to-body class="date-picker-popup" origin="top-start" arrow>
  <blocks-date-panel class="date-picker-panel" />
</blocks-popup>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksDatePicker extends HTMLElement {
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
    this.popup = fragment.querySelector('blocks-popup')
    this.panel = fragment.querySelector('blocks-date-panel')
    this.shadowRoot.appendChild(fragment)
    this.id = `date-picker-${idSeed++}`
    this.popup.setAttribute('anchor', `#${this.id}`)

    this.input.onfocus = this.input.onclick = (e) => {
      this.popup.open = true
    }

    this.panel.addEventListener('input', e => {
      if (!this.panel.multiple) this.popup.open = false
      this.render()
    })
  }

  render() {
    if (this.multiple) {
      this.input.value = (this.value ?? []).map(date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`).join(', ')
    }
    else {
      this.input.value = this.value ? `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()}` : ''
    }
  }

  get value() {
    return this.panel.value
  }

  set value(value) {
    this.panel.value = value
  }

  get clearable() {
    return this.input.clearable
  }

  set clearable(value) {
    this.input.clearable = value
  }

  get depth() {
    return this.panel.depth
  }

  set depth(value) {
    this.panel.depth = value
  }

  get mindepth() {
    return this.panel.mindepth
  }

  set mindepth(value) {
    this.panel.mindepth = value
  }

  get startdepth() {
    return this.panel.startdepth
  }

  set startdepth(value) {
    this.panel.startdepth = value
  }

  get max() {
    return this.panel.max
  }

  set max(value) {
    this.panel.max = value
  }

  get multiple() {
    return this.panel.multiple
  }

  set multiple(value) {
    this.panel.multiple = value
  }

  get disableMethod() {
    return this.panel.disableMethod
  }

  set disableMethod(value) {
    this.panel.disableMethod = value
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      this._upgradeProperty(attr)
    })
    this.render()

    if (!this._onClickOutside) {
      this._onClickOutside = (e) => {
        if (this.popup.open && !this.contains(e.target) && !this.panel.contains(e.target)) {
          this.popup.open = false
        }
      }
    }

    document.addEventListener('click', this._onClickOutside)
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
    if (['depth', 'mindepth', 'startdepth', 'multiple', 'max', 'loading', 'startWeekOn'].includes(name)) {
      this.panel.setAttribute(name, newValue)
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

if (!customElements.get('blocks-date-picker')) {
  customElements.define('blocks-date-picker', BlocksDatePicker)
}
