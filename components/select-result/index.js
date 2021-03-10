import '../tag/index.js'

import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_base, __height_base, __radius_base, __color_primary, __transition_duration, __height_small, __height_large } from '../theme/var.js'
import { getRegisteredSvgIcon } from '../../icon/index.js'
import { dispatchEvent } from '../../common/event.js'
import { clearableGetter, clearableSetter, multipleGetter, multipleSetter, sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'

const tagClearableGetter = boolGetter('tag-clearable')
const tagClearableSetter = boolSetter('tag-clearable')
const searchableGetter = boolGetter('searchable')
const searchableSetter = boolSetter('searchable')
const multipleModeGetter = enumGetter('multiple-mode', ['plain', 'tag'])
const multipleModeSetter = enumSetter('multiple-mode', ['plain', 'tag'])

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

#layout {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  font-size: 14px;
  white-space: nowrap;
  background-color: #fff;
}

#layout:focus {
  outline: 0 none;
}

:host(:focus-within) #layout {
  border-color: var(--color-primary, ${__color_primary});
}

#value {
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

bl-tag {
  flex: 0 0 auto;
}
bl-tag:focus {
  outline: 0 none;
}

.multiple-plain strong {
  margin-right: 4px;
  font-weight: normal;
  color: var(--color-primary, ${__color_primary});
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
.multiple-tag bl-tag+.search {
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
  transition: transform var(--transition-duration, ${__transition_duration});
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
  transition: all var(--transition-duration, ${__transition_duration});
}
:host([clearable]) #layout:hover #value:not(:empty)+.suffix-icon {
  visibility: hidden;
}
:host([clearable]) #layout:hover #value:not(:empty)+.clearable,
:host([clearable]) #layout:hover #value:not(:empty)+.suffix-icon+.clearable {
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
#layout {
  min-height: var(--height-base, ${__height_base});
}
#value {
  text-align: left;
  margin: 1px;
}
.value-text {
  margin: 0 4px;
}
bl-tag {
  height: calc(var(--height-base, ${__height_base}) - 4px);
  margin: 2px;
}

:host([size="small"]) #layout {
  min-height: var(--height-small, ${__height_small});
}
:host([size="small"]) bl-tag {
  height: calc(var(--height-small, ${__height_small}) - 4px);
}

:host([size="large"]) #layout {
  min-height: var(--height-large, ${__height_large});
}
:host([size="large"]) #value {
  margin: 3px;
}
:host([size="large"]) bl-tag {
  height: calc(var(--height-large, ${__height_large}) - 4px);
}

</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <div id="value"></div>
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

    this.$layout = shadowRoot.getElementById('layout')
    this.$value = shadowRoot.getElementById('value')

    this.$layout.oninput = e => {
      const value = e.target.value
      dispatchEvent(this, 'search', { detail: { value } })
    }

    this.$layout.onclick = e => {
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

    this.$layout.onclose = e => {
      const tag = e.target
      const label = tag.textContent
      const value = tag.value
      dispatchEvent(this, 'deselect', { detail: { tag, value, label } })
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
    return this.$value.textContent
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
      this.$layout.classList.remove(klass)
    })
    this.$layout.classList.add(this.multiple ? `multiple-${this.multipleMode}` : 'single')
  }

  renderSingle() {
    if (this.searchable) {
      const $search = this.$value.appendChild(document.createElement('input'))
      $search.className = 'search'
      $search.setAttribute('tabindex', '-1')
      // 使 placeholder-show 伪类生效
      $search.setAttribute('placeholder', ' ')
    }
    const label = this.formatMethod(this.value)
    if (label) {
      const $valueText = this.$value.querySelector('.value-text') ?? this.$value.appendChild(document.createElement('div'))
      $valueText.className = 'value-text'
      $valueText.textContent = label
    }
    else {
      const $valueText = this.$value.querySelector('.value-text')
      if ($valueText) this.$value.removeChild($valueText)
    }
  }

  renderMultipleTag() {
    this.value.forEach(item => {
      const label = this.formatMethod(item)
      const value = item.value
      const $tag = document.createElement('bl-tag')
      $tag.setAttribute('size', 'mini')
      $tag.setAttribute('tabindex', '-1')
      $tag.textContent = label
      $tag.value = value

      if (this.tagClearable) {
        $tag.setAttribute('closable', '')
      }

      this.$value.appendChild($tag)
    })

    if (this.searchable) {
      const $search = this.$value.appendChild(document.createElement('input'))
      $search.className = 'search'
      $search.setAttribute('tabindex', '-1')
      // 使 placeholder-show 伪类生效
      $search.setAttribute('placeholder', ' ')
    }
  }

  renderMultiplePlain() {
    if (this.searchable) {
      const $search = this.$value.appendChild(document.createElement('input'))
      $search.className = 'search'
      $search.setAttribute('tabindex', '-1')
      // 使 placeholder-show 伪类生效
      $search.setAttribute('placeholder', ' ')
    }

    if (this.value.length) {
      const $valueText = this.$value.appendChild(document.createElement('div'))
      $valueText.className = 'value-text'

      const label = this.formatMethod(this.value[0])
      if (this.value.length === 1) {
        $valueText.textContent = label
      }
      else {
        const $strong = document.createElement('strong')
        $strong.textContent = label
        const span = document.createElement('span')
        span.textContent = `等${this.value.length}项`
        $strong.className = span.className = 'plain'
        $valueText.appendChild($strong)
        $valueText.appendChild(span)
      }
    }
  }

  renderClearable() {
    if (this.clearable) {
      const $clearable = this.$layout.querySelector('.clearable') ?? this.$layout.appendChild(document.createElement('button'))
      $clearable.className = 'clearable'
      $clearable.setAttribute('part', 'clearable')
      $clearable.setAttribute('tabindex', '-1')
      this.$layout.appendChild($clearable)
    }
    else {
      const $clearable = this.$layout.querySelector('.clearable')
      if ($clearable) this.$layout.removeChild($clearable)
    }
  }

  renderIcon() {
    const prefixIcon = getRegisteredSvgIcon(this.prefixIcon)
    if (prefixIcon) {
      let $prefix = this.$layout.querySelector('.prefix-icon') ?? this.$layout.insertBefore(document.createElement('span'), this.$layout.firstElementChild)
      $prefix.innerHTML = ''
      $prefix.className = 'prefix-icon'
      $prefix.setAttribute('part', 'prefix')
      $prefix.appendChild(prefixIcon)
    }
    else {
      let $prefix = this.$layout.querySelector('.prefix-icon')
      if ($prefix) this.$layout.removeChild($prefix)
    }

    const suffixIcon = getRegisteredSvgIcon(this.suffixIcon)
    if (suffixIcon) {
      let $suffix = this.$layout.querySelector('.suffix-icon')
      if (!$suffix) {
        $suffix = document.createElement('span')
        const clear = this.querySelector('.clearable')
        if (clear) {
          this.$layout.insertBefore($suffix, clear)
        }
        else {
          this.$layout.appendChild($suffix)
        }
      } 
      $suffix.innerHTML = ''
      $suffix.className = 'suffix-icon'
      $suffix.setAttribute('part', 'suffix')
      $suffix.appendChild(suffixIcon)
    }
    else {
      let $suffix = this.$layout.querySelector('.suffix-icon')
      if ($suffix) this.$layout.removeChild($suffix)
    }
  }

  render() {
    // 清空
    Array.prototype.forEach.call(this.$layout.children, el => {
      if (el !== this.$value) this.$layout.removeChild(el)
    })
    this.$value.innerHTML = ''

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
      this.$layout.setAttribute('tabindex', '0')
    }

    this.render()
  }

  disconnectedCallback() { }

  adoptedCallback() { }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.disabled) {
      this.$layout.removeAttribute('tabindex')
      this.setAttribute('aria-disabled', 'true')
    }
    else {
      this.$layout.setAttribute('tabindex', '0')
      this.setAttribute('aria-disabled', 'false')
    }

    this.render()
  }
}

if (!customElements.get('bl-select-result')) {
  customElements.define('bl-select-result', BlocksSelectResult)
}
