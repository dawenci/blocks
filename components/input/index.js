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
} from '../../theme/var.js'

import { getRegisteredSvgIcon } from '../../icon/index.js'
import '../popup/index.js'
import '../date/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { setDisabled, setRole } from '../../common/accessibility.js'
import { clearableGetter, clearableSetter, sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import { dispatchEvent } from '../../common/event.js'
import { boolGetter, boolSetter } from '../../common/property.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  vertical-align: middle;
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
  color: inherit;
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

const INPUT_ATTRS = [
  'value',
  'type',
  'step',
  'readonly',
  'placeholder',
  'name',
  'multiple',
  'min',
  'max',
  'minlength',
  'maxlength',
  'autocomplete',
]


export default class BlocksInput extends HTMLElement {
  static get observedAttributes() {
    return INPUT_ATTRS.concat([
      'prefix-icon',
      'suffix-icon',
      'clearable',
      'size',
      'autofocus',
    ])
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
        dispatchEvent(this, 'click-prefix-icon')
      }
      else if (target.classList.contains('suffix-icon')) {
        dispatchEvent(this, 'click-suffix-icon')
      }
      else if (target.classList.contains('clearable')) {
        dispatchEvent(this, 'click-clear')
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
  }

  get suffixIcon() {
    return this.getAttribute('suffix-icon')
  }

  set suffixIcon(value) {
    this.setAttribute('suffix-icon', value)
  }

  get clearable() {
    return clearableGetter(this)
  }

  set clearable(value) {
    clearableSetter(this, value)
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(value) {
    this.setAttribute('value', value)
  }

  get type() {
    return this.getAttribute('type')
  }

  set type(value) {
    this.setAttribute('type', value)
  }

  get step() {
    return this.getAttribute('step')
  }

  set step(value) {
    this.setAttribute('step', value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get readonly() {
    return boolGetter('readonly')(this)
  }

  set readonly(value) {
    boolSetter('readonly')(this, value)
  }

  get placeholder() {
    return this.getAttribute('placeholder')
  }

  set placeholder(value) {
    this.setAttribute('placeholder', value)
  }

  get name() {
    return this.getAttribute('name')
  }

  set name(value) {
    this.setAttribute('name', value)
  }

  get min() {
    return this.getAttribute('min')
  }

  set min(value) {
    this.setAttribute('min', value)
  }

  get max() {
    return this.getAttribute('max')
  }

  set max(value) {
    this.setAttribute('max', value)
  }

  get minlength() {
    return this.getAttribute('minlength')
  }

  set minlength(value) {
    this.setAttribute('minlength', value)
  }

  get maxlength() {
    return this.getAttribute('maxlength')
  }

  set maxlength(value) {
    this.setAttribute('maxlength', value)
  }

  get autofocus() {
    return boolGetter('autofocus')(this)
  }

  set autofocus(value) {
    boolSetter('autofocus')(this, value)
  }

  get autocomplete() {
    return boolGetter('autocomplete')(this)
  }

  set autocomplete(value) {
    boolSetter('autocomplete')(this, value)
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

  adoptedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (INPUT_ATTRS.includes(name)) {
      this.$input.setAttribute(name, newValue)
      this.$input.value = newValue
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    }

    if (name === 'disabled') {
      setDisabled(this, this.disabled)
    }

    this.render()
  } 
}

if (!customElements.get('bl-input')) {
  customElements.define('bl-input', BlocksInput)
}
