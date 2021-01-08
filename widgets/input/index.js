import {
  $radiusBase,
  $colorPrimary,
  $colorWarning,
  $transitionDuration,
  $borderColorBase,
  $borderColorDisabled,
  $heightBase,
  $heightMini,
  $heightSmall,
  $heightLarge,
} from '../theme/var.js'

import { getIconSvg } from '../icon/index.js'
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
  position: relative;
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
  flex: 1 1 100%;
  font-size: inherit;
  padding: 0 9px;
  border: 0 none;
  line-height: 1;
  background: transparent;
}

input:focus {
  outline: 0 none;
}

.prefix-icon, .suffix-icon {
  flex: 0 0 auto;
  display: block;
  position: relative;
  width: 16px;
  height: 16px;
  fill: #aaa;
  transition: transform ${$transitionDuration};
}
.prefix-icon {
  margin-left: 6px;
}
.suffix-icon {
  margin-right: 6px;
}
.prefix-icon svg,
.suffix-icon svg {
  width: 100%;
  height: 100%;
}

.clearable {
  flex: 0 0 auto;
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
  margin: 0 6px 0 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 50%;
  background-color: transparent;
  opacity: 0;
  transform: rotate(45deg);
  transition: all ${$transitionDuration};
}
.container:hover .clearable {
  opacity: 1;
}
:host([clearable]) .container:hover .suffix-icon {
  visibility: hidden;
}
:host([suffix-icon]) .clearable {
  position: absolute;
  top: 0;
  right: 6px;
  bottom: 0;
  left: auto;
  margin: auto;
}

.clearable::before,
.clearable::after {
  display: block;
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  height: 2px;
  background: #ddd;
  margin: auto;
}
.clearable::before {
  width: 8px;
}
.clearable::after {
  height: 8px;
}
.clearable:hover {
  border-color: #aaa;
}
.clearable:hover::before,
.clearable:hover::after {
  background-color: #aaa;
}
.clearable:focus {
  outline: 0 none;
}
</style>`

const TEMPLATE_HTML = `
<div class="container">
  <input class="input" part="input" />
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksInput extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
      'prefix-icon',
      'suffix-icon',
      'clearable',
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
    this.container = fragment.querySelector('.container')
    this.input = fragment.querySelector('input')
    this.shadowRoot.appendChild(fragment)

    this.container.onclick = (e) => {
      const target = e.target
      if (target.classList.contains('prefix-icon')) {
        this.dispatchEvent(new CustomEvent('click-prefix-icon', { bubbles: true, composed: true, cancelable: true }))
      }
      else if (target.classList.contains('suffix-icon')) {
        this.dispatchEvent(new CustomEvent('click-suffix-icon', { bubbles: true, composed: true, cancelable: true }))
      }
      else if (target.classList.contains('clearable')) {
        this.dispatchEvent(new CustomEvent('click-clear', { bubbles: true, composed: true, cancelable: true }))
      }
    }
  }

  render() {
    const prefixIcon = getIconSvg(this.prefixIcon)
    if (prefixIcon) {
      if (this.prefixEl) {
        this.container.removeChild(this.prefixEl)
      }
      this.prefixEl = this.container.insertBefore(document.createElement('span'), this.input)
      this.prefixEl.className = 'prefix-icon'
      this.prefixEl.setAttribute('part', 'prefix')
      this.prefixEl.appendChild(prefixIcon)
    }

    const suffixIcon = getIconSvg(this.suffixIcon)
    if (suffixIcon) {
      if (this.suffixEl) {
        this.container.removeChild(this.suffixEl)
      }
      this.suffixEl = this.container.appendChild(document.createElement('span'))
      this.suffixEl.className = 'suffix-icon'
      this.suffixEl.setAttribute('part', 'suffix')
      this.suffixEl.appendChild(suffixIcon)
    }

    if (this.clearable) {
      if (!this.clearableEl) {
        this.clearableEl = document.createElement('button')
        this.clearableEl.className = 'clearable'
        this.clearableEl.setAttribute('part', 'clearable')
        this.clearableEl.onclick = this.clearValue.bind(this)
      }
      if (this.suffixIcon) {
        this.container.insertBefore(this.clearableEl, this.suffixEl)
      }
      else {
        this.container.appendChild(this.clearableEl)
      }
    }
  }

  get prefixIcon() {
    return this.getAttribute('prefix-icon')
  }

  set prefixIcon(value) {
    this.setAttribute('prefix-icon', value)
    this.render()
  }

  get suffixIcon() {
    return this.getAttribute('suffix-icon')
  }

  set suffixIcon(value) {
    this.setAttribute('suffix-icon', value)
    this.render()
  }

  get clearable() {
    return this.hasAttribute('clearable')
  }

  set clearable(value) {
    if (value === null || value === false) {
      this.removeAttribute('clearable')
    }
    else {
      this.setAttribute('clearable', '')
    }
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

  clearValue() {
    this.input.value = null
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
