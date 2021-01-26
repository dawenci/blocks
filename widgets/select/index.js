import './optgroup.js'
import './option.js'
import '../popup/index.js'
import '../input/index.js'
import '../select-result/index.js'

import { boolGetter, boolSetter, enumGetter, enumSetter } from '../core/property.js'
import {
  $radiusBase
} from '../theme/var.js'
import { every, filter, find, forEach, map, property, propertyEq } from '../core/utils.js'
import { upgradeProperty } from '../core/upgradeProperty.js'
import { setDisabled, setRole } from '../core/accessibility.js'

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
  width: 180px;
  user-select: none;
  cursor: default;
}
.dropdown::part(suffix) {
  transform: rotate(180deg);
}
blocks-select-result {
  width: 100%;
}
</style>`

const TEMPLATE_HTML = `
<blocks-select-result suffix-icon="down" class="date-picker-input" readonly></blocks-select-result>
<blocks-popup append-to-body class="date-picker-popup" origin="top-start" arrow>
  <div class="option-list" style="overflow:hidden;min-height:20px;border-radius:${$radiusBase};"></div>
</blocks-popup>
<slot style="display:none;"></slot>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksSelect extends HTMLElement {
  static get observedAttributes() {
    return [
      // 是否多选
      'multiple',
      // 多选结果显示模式，可选 plain 或 tag
      'multiple-mode',
      // 结果是否可以清空
      'clearable',
      // 多选结果 tag 是否可以关闭
      'tag-clearable',
      // 是否可以搜索
      'searchable',
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

    const id = `select-${idSeed++}` 

    const fragment = template.content.cloneNode(true)
    this._result = fragment.querySelector('blocks-select-result')
    this._popup = fragment.querySelector('.date-picker-popup')
    this._list = fragment.querySelector('.option-list')
    this._optionSlot = fragment.querySelector('slot')
    this.id = id
    this._popup.setAttribute('anchor', `#${id}`)
    this.shadowRoot.appendChild(fragment)

    this._result.onfocus = this._result.onfocus = e => {
      this._popup.style.minWidth = `${this._result.offsetWidth}px`
      this._popup.open = true
      this._result.classList.add('dropdown')
    }

    this._list.onclick = e => {
      const target = e.target
      if (target.tagName === 'BLOCKS-OPTION') {
        if (target.disabled) return
        if (target.parentElement.tagName === 'BLOCKS-OPTGROUP' && target.parentElement.disabled) return
        if (this.multiple) {
          target.selected = !target.selected
        }
        else {
          const selected = this._list.querySelector('[selected]')
          if (selected && selected !== target) {
            selected.selected = false
          }
          target.selected = true
        }
      }
      this.render()
    }

    this._result.addEventListener('click-clear', e => {
      this.value = this.multiple ? [] : null
      forEach(this._list.querySelectorAll('[selected]'), option => {
        option.selected = false
      })
    })

    this._list.addEventListener('select', e => {
      const target = e.target
      // 单选模式
      if (!this.multiple) {
        console.log('单选选中')
        const newValue = { value: target.value, label: target.label ?? target.textContent ?? target.value }
        this._result.value = newValue
        this._popup.open = false
        this._result.classList.remove('dropdown')
      }

      // 多选模式
      else {
        console.log('多选选中')
        const newValue = this._result.value.slice()
        newValue.push({ value: target.value, label: target.label ?? target.textContent ?? target.value })
        this._result.value = newValue
      }
    })

    this._list.addEventListener('deselect', e => {
      const target = e.target
      // 单选模式
      if (!this.multiple) {
        console.log('单选取消选中')
        this._result.value = null
      }

      // 多选模式
      else {
        console.log('多选取消选中')
        const newValue = this._result.value.filter(item => item.value !== target.value)
        this._result.value = newValue
      }
    })

    this._result.addEventListener('deselect', e => {
      const selected = find(this.options, option => option.value === e.detail.value)
      if (selected) selected.selected = false
    })

    this._result.onsearch = e => {
      this.searchStr = e.detail.value
      this.filter()
    }
  }

  render() {
  }

  filter() {
    const searchStr = this.searchStr
    forEach(this.options, option => {
      option.style.display = this.searchMethod(option, searchStr) ? '' : 'none'
    })
    forEach(this._list.querySelectorAll('blocks-optgroup'), group => {
      const options = group.querySelectorAll('blocks-option')
      group.style.display = every(options, option => option.style.display === 'none') ? 'none' : ''
    })
  }

  get options() {
    return this._list.querySelectorAll('blocks-option')
  }

  get multiple() {
    return this._result.multiple
  }

  set multiple(value) {
    this._result.multiple = value
  }

  get multipleMode() {
    return this._result.multipleMode
  }

  set multipleMode(value) {
    this._result.multipleMode = value
  }

  get formatMethod() {
    return this._result.formatMethod
  }

  set formatMethod(value) {
    this._result.formatMethod = value
  }

  get label() {
    return this._result.label
  }

  get selectedOptions() {
    return this._result.value
  }

  set selectedOptions(value) {
    this._result.value = value
    const valueMap = Object.create(null)
    const values = this.multiple ? this._result.value : this._result.value ? [this._result.value] : []
    values.forEach(item => {
      valueMap[item.value] = true
    })
    forEach(this.options, option => {
      option.silentSelected(!!valueMap[option.value])
    })
  }

  get clearable() {
    return this._result.clearable
  }

  set clearable(value) {
    this._result.clearable = value
  }

  get tagClearable() {
    return this.tagClearable.clearable
  }

  set tagClearable(value) {
    this._result.tagClearable = value
  }

  get searchable() {
    return this._result.searchable
  }

  set searchable(value) {
    this._result.searchable = value
  }

  get max() {
    return parseInt(this.getAttribute('max')) || 0
  }

  set max(value) {
    this.setAttribute('max', value)
  }

  get searchMethod() {
    return this._searchMethod ?? ((option, searchStr) => (option.label ?? option.textContent).includes(searchStr))
  }

  set searchMethod(value) {
    if (typeof value !== 'function') return
    this._searchMethod = value
  }

  connectedCallback() {
    setRole(this, 'select')
    setDisabled(this, this.disabled)

    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()

    if (!this._onClickOutside) {
      this._onClickOutside = (e) => {
        if (this._popup.open && !this.contains(e.target) && !this._popup.contains(e.target)) {
          this._popup.open = false
          this._result.classList.remove('dropdown')
        }
      }
    }

    document.addEventListener('click', this._onClickOutside)

    this._optionSlot.addEventListener('slotchange', e => {
      this.initOptions()
    })
  }

  initOptions() {
    this._list.innerHTML = ''

    const isOption = el => el instanceof customElements.get('blocks-option')
    const isGroup = el => el instanceof customElements.get('blocks-optgroup')

    // 将 slot 传入的 option 等拷贝到 popup 里
    this._optionSlot.assignedElements()
      .forEach(el => {
        if (isOption(el) || isGroup(el)) {
          const copy = el.cloneNode(true)
          if (copy.id) delete copy.id
          this._list.appendChild(copy)
        }
      })
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onClickOutside)
  }

  // adoptedCallback() {
  // }

  attributeChangedCallback(name, oldValue, newValue) {
    if (['clearable', 'tag-clearable', 'multiple', 'multiple-mode', 'searchable'].includes(name)) {
      this._result.setAttribute(name, newValue)
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
    this._popup.focus()
  }

  _blur() {
    this._popup.blur()
    if (this._prevFocus) {
      if (this.restorefocus && typeof this._prevFocus.focus) {
        this._prevFocus.focus()
      }
      this._prevFocus = undefined
    }
  }
}

if (!customElements.get('blocks-select')) {
  customElements.define('blocks-select', BlocksSelect)
}
