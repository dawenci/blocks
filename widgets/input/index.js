import {
  $radiusBase,
  $colorPrimary,
  $colorWarn,
  $transitionDuration,
  $borderColorBase,
  $borderColorDisabled,
  $heightBase,
  $heightMini,
  $heightSmall,
  $heightLarge,
} from '../theme/var.js'

import '../popup/index.js'
import '../date-panel/index.js'

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host(:focus) {
  outline: 0 none;
}
:host {
  overflow: hidden;
  display: inline-block;
  user-select: none;
  cursor: default;
}

.container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  height: ${$heightBase};
  border: 1px solid ${$borderColorBase};
  background-color: #fff;
  border-radius: ${$radiusBase};
  font-size: 14px;
}
:host([size="mini"]) .container {
  height: ${$heightMini};
  font-size: 12px;
}
:host([size="small"]) .container {
  height: ${$heightSmall};
}
:host([size="large"]) .container {
  height: ${$heightLarge};
  font-size: 16px;
}
:host(:focus-within) .container {
  border-color: ${$colorPrimary};
}

input {
  font-size: inherit;
  padding: 0 9px;
  border: 0 none;
  line-height: 1;
  background: transparent;
}

input:focus {
  outline: 0 none;
}

</style>`

const TEMPLATE_HTML = `
<div class="container">
  <input class="input" />
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksInput extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
      'type',
      'step',
      'size',
      'readonly',
      'placeholder',
      'name',
      'multiple',
      'min',
      'max',
      'minlength',
      'maxlength',
      'autofocus',
      'autocomplete',
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
    this.input = fragment.querySelector('input')
    this.shadowRoot.appendChild(fragment)
  }

  render() {
  }

  get value() {
    return this.input.value
  }

  set value(value) {
    this.input.value = value
  }

  get type() {
    return this.input.type
  }

  set type(value) {
    this.input.type = value
  }

  get step() {
    return this.input.step
  }

  set step(value) {
    this.input.step = value
  }

  get size() {
    return this.getAttribute('size')
  }

  set size(value) {
    this.setAttribute('size', value)
  }

  get readonly() {
    return this.input.readonly
  }

  set readonly(value) {
    this.input.readonly = value
  }

  get placeholder() {
    return this.input.placeholder
  }

  set placeholder(value) {
    this.input.placeholder = value
  }

  get name() {
    return this.input.name
  }

  set name(value) { 
    this.input.name = value
  }

  get min() {
    return this.input.min
  }

  set min(value) {
    this.input.min = value
  }

  get max() {
    return this.input.max
  }

  set max(value) {
    this.input.max = value
  }

  get minlength() {
    return this.input.minlength
  }

  set minlength(value) {
    this.input.minlength = value
  }

  get maxlength() {
    return this.input.maxlength
  }

  set maxlength(value) {
    this.input.maxlength = value
  }

  get autofocus() {
    return this.input.autofocus
  }

  set autofocus(value) {
    this.input.autofocus = value
  }

  get autocomplete() {
    return this.input.autocomplete
  }

  set autocomplete(value) {
    this.input.autocomplete = value
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      this._upgradeProperty(attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  // adoptedCallback() {
  // }

  attributeChangedCallback(name, oldValue, newValue) {
    if ([
      'value',
      'type',
      'step',
      'size',
      'readonly',
      'placeholder',
      'name',
      'multiple',
      'min',
      'max',
      'minlength',
      'maxlength',
      'autofocus',
      'autocomplete',
    ].includes(name)) {
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

if (!customElements.get('blocks-input')) {
  customElements.define('blocks-input', BlocksInput)
}
