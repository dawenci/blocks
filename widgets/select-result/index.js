import '../tag/index.js'

import { boolGetter, boolSetter, enumSetter } from '../core/property.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { $borderColorBase, $heightBase, $radiusBase } from '../theme/var.js'

const multipleGetter = boolGetter('multiple')
const multipleSetter = boolSetter('multiple')
const clearableGetter = boolGetter('clearable')
const clearableSetter = boolSetter('clearable')
const tagClearableGetter = boolGetter('tag-clearable')
const tagClearableSetter = boolSetter('tag-clearable')
const searchableGetter = boolGetter('searchable')
const searchableSetter = boolSetter('searchable')
const multipleModeGetter = enumSetter('multiple-mode', ['plain', 'tag'])
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

.widget {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  position: relative;
  height: ${$heightBase};
  padding: 0 4px;
  border: 1px solid ${$borderColorBase};
  background-color: #fff;
  border-radius: ${$radiusBase};
  font-size: 14px;
  white-space: nowrap;
}

blocks-tag {
  flex: 0 0 auto;
}
input {
  flex: 1 1 100%;
  min-width: 32px;
  width: 32px;
  border: 0;
  background: transparent;
}
input:focus {
  outline: 0 none;
}
blocks-tag+blocks-tag,
blocks-tag+input {
  margin-left: 4px;
}
</style>`

const TEMPLATE_HTML = `
<div class="widget">
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksSelectResult extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

    this._widget = shadowRoot.querySelector('.widget')

    this._widget.onchange = e => {
      const value = e.target.value
      this.dispatchEvent(new CustomEvent('search', { detail: { value } }))
    }
  }

  get multiple() {
    return multipleGetter(this)
  }

  set multiple(value) {
    multipleSetter(this, value)
  }

  get multipleMode() {
    return multipleModeGetter(this)
  }

  set multipleMode(value) {
    multipleModeSetter(this, value)
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
  }

  get searchable() {
    return searchableGetter(this)
  }

  set searchable(value) {
    searchableSetter(this, value)
  }

  get data() {
    return this._data || this.multiple ? [] : null
  }

  set data(value) {
    if (this.multiple) {
      if (!Array.isArray(value)) return
      this._data = value
    }

    else {
      if (typeof value !== 'object') return
      this._data = value
    }

    this.render()
  }

  get formatMethod() {
    return this._formatMethod ?? (item => item.label)
  }

  set formatMethod(value) {
    if (typeof value === 'function') {
      this._formatMethod = value
    }
  }

  render() {
    if (!this.multiple) {
      const label = this.formatMethod(this.data)
      this._widget.textContent = label
      return
    }

    if (!this.data.length) {
      this._widget.innerHTML = ''
      return
    }

    if (this.multipleMode === 'plain') {
      const label = this.formatMethod(this.data[0])
      if (this.data.length === 1) {
        this._widget.textContent = label
      }
      else {
        this._widget.textContent = `${label}等${this.data.length}项`
      }
      return
    }

    this._widget.innerHTML = ''
    this.data.forEach(item => {
      const label = this.formatMethod(item)
      const value = item.value
      const tag = document.createElement('blocks-tag')
      tag.setAttribute('size', 'mini')
      tag.textContent = label
      tag.value = value

      if (this.tagClearable) {
        tag.setAttribute('closable', '')
      }

      this._widget.appendChild(tag)
    })

    if (this.searchable) {
      this._widget.appendChild(document.createElement('input'))
    }

    if (this.clearable) {
      this._widget.classList.add('clearable')
    }
    else {
      this._widget.classList.remove('clearable')
    }
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}
}

if (!customElements.get('blocks-select-result')) {
  customElements.define('blocks-select-result', BlocksSelectResult)
}
