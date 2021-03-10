import {
  __radius_base,
  __color_primary,
  __color_warning,
  __transition_duration,
  __border_color_base,
  __border_color_disabled,
  __height_base,
  __height_small,
  __height_large,
} from '../theme/var.js'

import { getRegisteredSvgIcon } from '../../icon/index.js'
import '../popup/index.js'
import '../date-panel/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { setDisabled, setRole } from '../../common/accessibility.js'
import { clearableGetter, clearableSetter, sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  overflow: hidden;
  cursor: default;
  user-select: none;
  font-size: 14px;
  height: var(--height-base, ${__height_base});
  border: 1px solid var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  background-color: #fff;
}
:host(:focus) {
  outline: 0 none;
}
:host(:focus-within) {
  border-color: var(--color-primary, ${__color_primary});
}
:host([size="small"]) {
  height: var(--height-small, ${__height_small});
  font-size: 12px;
}
:host([size="large"]) {
  height: var(--height-large, ${__height_large});
  font-size: 16px;
}

.layout {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
}

input {
  flex: 1 1 100%;
  width: 100%;
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
  transition: transform var(--transition-duration, ${__transition_duration});
}
.prefix-icon {
  margin-left: 6px;
}
.suffix-icon {
  margin-right: 6px;
}
.prefix-icon > svg,
.suffix-icon > svg {
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
  transition: all var(--transition-duration, ${__transition_duration});
}
:host(:hover) .clearable {
  opacity: 1;
}
:host([clearable]:hover) .suffix-icon {
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
<div class="layout">
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
    this.$layout = fragment.querySelector('.layout')
    this.$input = fragment.querySelector('input')
    this.shadowRoot.appendChild(fragment)

    this.$layout.onclick = (e) => {
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
    const prefixIcon = getRegisteredSvgIcon(this.prefixIcon)
    if (prefixIcon) {
      if (this.$prefix) {
        this.$layout.removeChild(this.$prefix)
      }
      this.$prefix = this.$layout.insertBefore(document.createElement('span'), this.$input)
      this.$prefix.className = 'prefix-icon'
      this.$prefix.setAttribute('part', 'prefix')
      this.$prefix.appendChild(prefixIcon)
    }

    const suffixIcon = getRegisteredSvgIcon(this.suffixIcon)
    if (suffixIcon) {
      if (this.$suffix) {
        this.$layout.removeChild(this.$suffix)
      }
      this.$suffix = this.$layout.appendChild(document.createElement('span'))
      this.$suffix.className = 'suffix-icon'
      this.$suffix.setAttribute('part', 'suffix')
      this.$suffix.appendChild(suffixIcon)
    }

    if (this.clearable) {
      if (!this.$clearable) {
        this.$clearable = document.createElement('button')
        this.$clearable.className = 'clearable'
        this.$clearable.setAttribute('part', 'clearable')
        this.$clearable.onclick = this.clearValue.bind(this)
      }
      if (this.suffixIcon) {
        this.$layout.insertBefore(this.$clearable, this.$suffix)
      }
      else {
        this.$layout.appendChild(this.$clearable)
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
    return clearableGetter(this)
  }

  set clearable(value) {
    clearableSetter(this, value)
  }

  get value() {
    return this.$input.value
  }

  set value(value) {
    this.$input.value = value
  }

  get type() {
    return this.$input.type
  }

  set type(value) {
    this.$input.type = value
  }

  get step() {
    return this.$input.step
  }

  set step(value) {
    this.$input.step = value
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get readonly() {
    return this.$input.readonly
  }

  set readonly(value) {
    this.$input.readonly = value
  }

  get placeholder() {
    return this.$input.placeholder
  }

  set placeholder(value) {
    this.$input.placeholder = value
  }

  get name() {
    return this.$input.name
  }

  set name(value) {
    this.$input.name = value
  }

  get min() {
    return this.$input.min
  }

  set min(value) {
    this.$input.min = value
  }

  get max() {
    return this.$input.max
  }

  set max(value) {
    this.$input.max = value
  }

  get minlength() {
    return this.$input.minlength
  }

  set minlength(value) {
    this.$input.minlength = value
  }

  get maxlength() {
    return this.$input.maxlength
  }

  set maxlength(value) {
    this.$input.maxlength = value
  }

  get autofocus() {
    return this.$input.autofocus
  }

  set autofocus(value) {
    this.$input.autofocus = value
  }

  get autocomplete() {
    return this.$input.autocomplete
  }

  set autocomplete(value) {
    this.$input.autocomplete = value
  }

  clearValue() {
    this.$input.value = null
  }

  connectedCallback() {
    setRole(this, 'input')
    setDisabled(this, this.disabled)

    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
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
      this.$input.setAttribute(name, newValue)
    }

    if (name === 'disabled') {
      setDisabled(this, this.disabled)
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
}

if (!customElements.get('bl-input')) {
  customElements.define('bl-input', BlocksInput)
}
