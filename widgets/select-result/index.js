import '../tag/index.js'

import { boolGetter, boolSetter, enumGetter, enumSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { $borderColorBase, $heightBase, $radiusBase, $colorPrimary, $transitionDuration, $heightMini, $heightSmall, $heightLarge } from '../theme/var.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'

const multipleGetter = boolGetter('multiple')
const multipleSetter = boolSetter('multiple')
const clearableGetter = boolGetter('clearable')
const clearableSetter = boolSetter('clearable')
const tagClearableGetter = boolGetter('tag-clearable')
const tagClearableSetter = boolSetter('tag-clearable')
const searchableGetter = boolGetter('searchable')
const searchableSetter = boolSetter('searchable')
const multipleModeGetter = enumGetter('multiple-mode', ['plain', 'tag'])
const multipleModeSetter = enumSetter('multiple-mode', ['plain', 'tag'])
const sizeGetter = enumGetter('size', ['mini', 'small', 'large', null])
const sizeSetter = enumSetter('size', ['mini', 'small', 'large', null])

const TEMPLATE_CSS = `<style>
:host, :host * {
  box-sizing: border-box;
}
:host {
  overflow: hidden;
  display: inline-block;
  user-select: none;
  cursor: default;
}

.widget {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  border: 1px solid ${$borderColorBase};
  border-radius: ${$radiusBase};
  font-size: 14px;
  white-space: nowrap;
  background-color: #fff;
}

.widget:focus {
  outline: 0 none;
}

:host(:focus-within) .widget {
  border-color: ${$colorPrimary};
}

.value {
  flex: 1 1 100%;
  display: flex;
  min-height: 18px;
  flex-flow: row wrap;
  align-items: center;
  overflow: hidden;
  position: relative;
  font-size: 14px;
  white-space: nowrap;
}

blocks-tag {
  flex: 0 0 auto;
}
blocks-tag:focus {
  outline: 0 none;
}

.multiple-plain strong {
  margin-right: 4px;
  font-weight: normal;
  color: ${$colorPrimary};
}

.multiple-plain span {
  color: #888;
}


/* searchable */
.search {
  border: 0;
  background: rgba(255,255,255,0);
}
.search:focus {
  outline: 0 none;
  background: rgba(255,255,255,.5);
}

.single .search,
.multiple-plain .search {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 4px;
}
.single .search:not(:placeholder-shown) + .value-text,
.multiple-plain .search:not(:placeholder-shown) + .value-text {
  visibility: hidden;
}
.multiple-tag .search {
  flex: 1 1 auto;
  min-width: 32px;
}
.multiple-tag blocks-tag+.search {
  margin-left: 4px;
}


/* icon */
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


/* clearable */
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
:host([clearable]) .widget:hover .value:not(:empty)+.suffix-icon {
  visibility: hidden;
}
:host([clearable]) .widget:hover .value:not(:empty)+.clearable,
:host([clearable]) .widget:hover .value:not(:empty)+.suffix-icon+.clearable {
  opacity: 1;
}
.suffix-icon+.clearable {
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


/* size */
.widget {
  min-height: ${$heightBase};
}
.value {
  text-align: left;
  margin: 1px;
}
.value-text {
  margin: 0 4px;
}
blocks-tag {
  margin: 2px;
}

:host([size="mini"]) .widget {
  min-height: ${$heightMini};
}
:host([size="mini"]) blocks-tag {
  height: 18px;
  margin: 2px;
}

:host([size="small"]) .widget {
  min-height: ${$heightSmall};
}
:host([size="small"]) blocks-tag {
  height: 20px;
  margin: 2px;
}

:host([size="large"]) .widget {
  min-height: ${$heightLarge};
}
:host([size="large"]) .value {
  margin: 3px;
}
:host([size="large"]) blocks-tag {
  height: 28px;
  margin: 2px;
}

</style>`

const TEMPLATE_HTML = `
<div class="widget">
  <div class="value"></div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksSelectResult extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'multiple', 'multiple-mode', 'tag-clearable', 'clearable', 'searchable', 'prefix-icon', 'suffix-icon']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))

    this._widget = shadowRoot.querySelector('.widget')
    this._valuePrint = shadowRoot.querySelector('.value')

    this._widget.oninput = e => {
      const value = e.target.value
      this.dispatchEvent(new CustomEvent('search', {
        bubbles: true, composed: true, cancelable: true, detail: { value }
      }))
    }

    this._widget.onclick = e => {
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

    this._widget.onclose = e => {
      const tag = e.target
      const label = tag.textContent
      const value = tag.value
      this.dispatchEvent(new CustomEvent('deselect', {
        bubbles: true, composed: true, cancelable: true, detail: { tag, value, label }
      }))
    }
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
    this.render()
  }

  get multiple() {
    return multipleGetter(this)
  }

  set multiple(value) {
    multipleSetter(this, value)
    this.render()
  }

  get multipleMode() {
    return multipleModeGetter(this)
  }

  set multipleMode(value) {
    multipleModeSetter(this, value)
    this.render()
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

  get tagClearable() {
    return tagClearableGetter(this)
  }

  set tagClearable(value) {
    tagClearableSetter(this, value)
  }

  get clearable() {
    return clearableGetter(this)
  }

  set clearable(value) {
    clearableSetter(this, value)
    this.render()
  }

  get searchable() {
    return searchableGetter(this)
  }

  set searchable(value) {
    searchableSetter(this, value)
    this.render()
  }

  get label() {
    return this._valuePrint.textContent
  }

  get value() {
    return this._value || (this.multiple ? [] : null)
  }

  set value(value) {
    if (this.multiple) {
      if (Array.isArray(value)) {
        this._value = value
      }
    }
    else {
      if (typeof value === 'object') {
        this._value = value
      }
    }
    this.render()
  }

  get formatMethod() {
    return this._formatMethod ?? (item => item?.label ?? '')
  }

  set formatMethod(value) {
    if (typeof value === 'function') {
      this._formatMethod = value
    }
    this.render()
  }

  renderClass() {
    ['single', 'multiple-tag', 'multiple-plain'].forEach(klass => {
      this._widget.classList.remove(klass)
    })
    this._widget.classList.add(this.multiple ? `multiple-${this.multipleMode}` : 'single')
  }

  renderSingle() {
    if (this.searchable) {
      const search = this._valuePrint.appendChild(document.createElement('input'))
      search.className = 'search'
      search.setAttribute('tabindex', '-1')
      // 使 placeholder-show 伪类生效
      search.setAttribute('placeholder', ' ')
    }
    const label = this.formatMethod(this.value)
    const value = this._valuePrint.appendChild(document.createElement('div'))
    value.className = 'value-text'
    value.textContent = label
    this._valuePrint.appendChild(value)
  }

  renderMultipleTag() {
    this.value.forEach(item => {
      const label = this.formatMethod(item)
      const value = item.value
      const tag = document.createElement('blocks-tag')
      tag.setAttribute('size', 'mini')
      tag.setAttribute('tabindex', '-1')
      tag.textContent = label
      tag.value = value

      if (this.tagClearable) {
        tag.setAttribute('closable', '')
      }

      this._valuePrint.appendChild(tag)
    })

    if (this.searchable) {
      const search = this._valuePrint.appendChild(document.createElement('input'))
      search.className = 'search'
      search.setAttribute('tabindex', '-1')
      // 使 placeholder-show 伪类生效
      search.setAttribute('placeholder', ' ')
    }
  }

  renderMultiplePlain() {
    if (this.searchable) {
      const search = this._valuePrint.appendChild(document.createElement('input'))
      search.className = 'search'
      search.setAttribute('tabindex', '-1')
      // 使 placeholder-show 伪类生效
      search.setAttribute('placeholder', ' ')
    }

    if (this.value.length) {
      const value = this._valuePrint.appendChild(document.createElement('div'))
      value.className = 'value-text'

      const label = this.formatMethod(this.value[0])
      if (this.value.length === 1) {
        value.textContent = label
      }
      else {
        const strong = document.createElement('strong')
        strong.textContent = label
        const span = document.createElement('span')
        span.textContent = `等${this.value.length}项`
        strong.className = span.className = 'plain'
        value.appendChild(strong)
        value.appendChild(span)
      }
    }
  }

  renderClearable() {
    if (this.clearable) {
      const el = this._widget.querySelector('.clearable') ?? this._widget.appendChild(document.createElement('button'))
      el.className = 'clearable'
      el.setAttribute('part', 'clearable')
      el.setAttribute('tabindex', '-1')
      this._widget.appendChild(el)
    }
    else {
      const el = this._widget.querySelector('.clearable')
      if (el) this._widget.removeChild(el)
    }
  }

  renderIcon() {
    const prefixIcon = getRegisteredSvgIcon(this.prefixIcon)
    if (prefixIcon) {
      let el = this._widget.querySelector('.prefix-icon') ?? this._widget.insertBefore(document.createElement('span'), this._widget.firstElementChild)
      el.innerHTML = ''
      el.className = 'prefix-icon'
      el.setAttribute('part', 'prefix')
      el.appendChild(prefixIcon)
    }
    else {
      let el = this._widget.querySelector('.prefix-icon')
      if (el) this._widget.removeChild(el)
    }

    const suffixIcon = getRegisteredSvgIcon(this.suffixIcon)
    if (suffixIcon) {
      let el = this._widget.querySelector('.suffix-icon')
      if (!el) {
        el = document.createElement('span')
        const clear = this.querySelector('.clearable')
        if (clear) {
          this._widget.insertBefore(el, clear)
        }
        else {
          this._widget.appendChild(el)
        }
      } 
      el.innerHTML = ''
      el.className = 'suffix-icon'
      el.setAttribute('part', 'suffix')
      el.appendChild(suffixIcon)
    }
    else {
      let el = this._widget.querySelector('.suffix-icon')
      if (el) this._widget.removeChild(el)
    }
  }

  render() {
    // 清空
    Array.prototype.forEach.call(this._widget.children, el => {
      if (el !== this._valuePrint) this._widget.removeChild(el)
    })
    this._valuePrint.innerHTML = ''

    this.renderClass()

    if (!this.multiple) {
      this.renderSingle()
    }
    else if (this.multipleMode === 'plain') {
      this.renderMultiplePlain()
    }
    else {
      this.renderMultipleTag()
    }

    this.renderIcon()    

    this.renderClearable()
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    if (!this.disabled) {
      this._widget.setAttribute('tabindex', '0')
    }

    this.render()
  }

  disconnectedCallback() { }

  adoptedCallback() { }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.disabled) {
      this._widget.removeAttribute('tabindex')
      this.setAttribute('aria-disabled', 'true')
    }
    else {
      this._widget.setAttribute('tabindex', '0')
      this.setAttribute('aria-disabled', 'false')
    }

    this.render()
  }
}

if (!customElements.get('blocks-select-result')) {
  customElements.define('blocks-select-result', BlocksSelectResult)
}
