import './optgroup.js'
import './option.js'
import '../popup/index.js'
import '../input/index.js'
import '../select-result/index.js'

import { intGetter, intSetter } from '../../common/property.js'
import { __radius_base } from '../../theme/var.js'
import { every, find, forEach, findIndex } from '../../common/utils.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { setDisabled, setRole } from '../../common/accessibility.js'
import { onClickOutside } from '../../common/onClickOutside.js'

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
#result {
  width: 100%;
}
</style>`

const TEMPLATE_HTML_INPUT = `<bl-select-result suffix-icon="down" id="result" readonly></bl-select-result>
<slot style="display:none;"></slot>`

const TEMPLATE_HTML_POPUP = `<bl-popup append-to-body id="date-picker-popup" origin="top-start" arrow>
<div class="option-list" style="overflow:hidden;min-height:20px;border-radius:var(--radius-base, ${__radius_base});"></div>
</bl-popup>`

const inputTemplate = document.createElement('template')
inputTemplate.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML_INPUT

const popupTemplate = document.createElement('template')
popupTemplate.innerHTML = TEMPLATE_HTML_POPUP

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
      'searchable'
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

    const fragment = inputTemplate.content.cloneNode(true)
    this.$result = fragment.querySelector('bl-select-result')
    this.$optionSlot = fragment.querySelector('slot')

    this.shadowRoot.appendChild(fragment)

    this.$popup = popupTemplate.content.cloneNode(true).querySelector('#date-picker-popup')
    this.$popup.anchor = () => this.$result
    this.$list = this.$popup.querySelector('.option-list')

    this.$result.onfocus = this.$result.onfocus = (e) => {
      this.$popup.style.minWidth = `${this.$result.offsetWidth}px`
      this.$popup.open = true
      this.$result.classList.add('dropdown')
    }

    this.$list.onclick = (e) => {
      const target = e.target
      if (target.tagName === 'BL-OPTION') {
        this._selectOption(target)
      }
      this.render()
    }

    this.$result.addEventListener('click-clear', (e) => {
      this.value = this.multiple ? [] : null
      forEach(this.$list.querySelectorAll('[selected]'), (option) => {
        option.selected = false
      })
    })

    this.$list.addEventListener('select', (e) => {
      const target = e.target
      // 单选模式
      if (!this.multiple) {
        const newValue = { value: target.value, label: target.label ?? target.textContent ?? target.value }
        this.$result.value = newValue
        this.$popup.open = false
        this.$result.classList.remove('dropdown')
      }

      // 多选模式
      else {
        const newValue = this.$result.value.slice()
        newValue.push({ value: target.value, label: target.label ?? target.textContent ?? target.value })
        this.$result.value = newValue
      }
    })

    this.$list.addEventListener('deselect', (e) => {
      const target = e.target
      // 单选模式
      if (!this.multiple) {
        this.$result.value = null
      }

      // 多选模式
      else {
        const newValue = this.$result.value.filter((item) => item.value !== target.value)
        this.$result.value = newValue
      }
    })

    this.$result.addEventListener('deselect', (e) => {
      const selected = find(this.options, (option) => option.value === e.detail.value)
      if (selected) selected.selected = false
    })

    this.$result.onsearch = (e) => {
      this.searchStr = e.detail.value
      this.filter()
    }

    this.$popup.addEventListener('opened', () => {
      this._initClickOutside()
    })

    this.$popup.addEventListener('closed', () => {
      this._destroyClickOutside()
    })

    this._initKeymap()
  }

  get options() {
    return Array.prototype.slice.call(this.$list.querySelectorAll('bl-option'))
  }

  get multiple() {
    return this.$result.multiple
  }

  set multiple(value) {
    this.$result.multiple = value
  }

  get multipleMode() {
    return this.$result.multipleMode
  }

  set multipleMode(value) {
    this.$result.multipleMode = value
  }

  get formatMethod() {
    return this.$result.formatMethod
  }

  set formatMethod(value) {
    this.$result.formatMethod = value
  }

  get label() {
    return this.$result.label
  }

  get selectedOptions() {
    return this.$result.value
  }

  set selectedOptions(value) {
    this.$result.value = value
    const valueMap = Object.create(null)
    const values = this.multiple ? this.$result.value : this.$result.value ? [this.$result.value] : []
    values.forEach((item) => {
      valueMap[item.value] = true
    })
    forEach(this.options, (option) => {
      option.silentSelected(!!valueMap[option.value])
    })
  }

  get clearable() {
    return this.$result.clearable
  }

  set clearable(value) {
    this.$result.clearable = value
  }

  get tagClearable() {
    return this.tagClearable.clearable
  }

  set tagClearable(value) {
    this.$result.tagClearable = value
  }

  get searchable() {
    return this.$result.searchable
  }

  set searchable(value) {
    this.$result.searchable = value
  }

  get max() {
    return intGetter('max')(this) || 0
  }

  set max(value) {
    intSetter('max')(this, value)
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

    this.constructor.observedAttributes.forEach((attr) => {
      upgradeProperty(this, attr)
    })
    document.body.appendChild(this.$popup)

    this.render()

    this.$optionSlot.addEventListener('slotchange', (e) => {
      this.initOptions()
    })
  }

  disconnectedCallback() {
    document.body.removeChild(this.$popup)
    this._destroyClickOutside()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (['clearable', 'tag-clearable', 'multiple', 'multiple-mode', 'searchable'].includes(name)) {
      this.$result.setAttribute(name, newValue)
    }

    if (name === 'disabled') {
      setDisabled(this, this.disabled)
    }

    this.render()
  }

  initOptions() {
    this.$list.innerHTML = ''

    const isOption = (el) => el instanceof customElements.get('bl-option')
    const isGroup = (el) => el instanceof customElements.get('bl-optgroup')

    // 将 slot 传入的 option 等拷贝到 popup 里
    this.$optionSlot.assignedElements().forEach((el) => {
      if (isOption(el) || isGroup(el)) {
        const copy = el.cloneNode(true)
        copy.setAttribute('tabindex', '0')
        if (copy.id) delete copy.id
        this.$list.appendChild(copy)
      }
    })
  }

  _selectOption(option) {
    if (option.disabled) return
    if (option.parentElement.tagName === 'BL-OPTGROUP' && option.parentElement.disabled) return
    if (this.multiple) {
      option.selected = !option.selected
    } else {
      const selected = this.$list.querySelector('[selected]')
      if (selected && selected !== option) {
        selected.selected = false
      }
      option.selected = true
    }
  }

  _initKeymap() {
    // 快捷键控制焦点移动
    let currentFocusValue
    const focusPrev = () => {
      const all = this.options.filter((el) => !el.disabled)
      if (!all.length) return
      const index = findIndex(all, (item) => item.value === currentFocusValue)
      const prev = all[index - 1] ?? all[all.length - 1]
      if (prev) {
        prev.focus()
        currentFocusValue = prev.value
      }
    }

    const focusNext = () => {
      const all = this.options.filter((el) => !el.disabled)
      if (!all.length) return
      const index = findIndex(all, (item) => item.value === currentFocusValue)
      const next = all[index + 1] ?? all[0]
      if (next) {
        next.focus()
        currentFocusValue = next.value
      }
    }

    // 在 result 上按 tab、上下方向键，foucs 第一个选项
    this.$result.onkeydown = (e) => {
      if (e.key === 'Escape') {
        this.$popup.open = false
        this.$result.blur()
        this.$result.classList.remove('dropdown')
      }
      if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const first = this.options.find((el) => !el.disabled)
        if (first) {
          currentFocusValue = first.value
          first.focus()
        }
      }
    }

    // 在 list 上按 tab、shift + tab，上下方向键，上下移动焦点
    this.$popup.onkeydown = (e) => {
      if (e.key === 'Escape') {
        this.$popup.open = false
        this.$result.classList.remove('dropdown')
      } else if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        focusNext()
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        focusPrev()
      } else if (e.key === ' ' || e.key === 'Enter') {
        const option = this.options.find((item) => item.value === currentFocusValue)
        if (option) this._selectOption(option)
      }
    }
  }

  render() {}

  filter() {
    const searchStr = this.searchStr
    forEach(this.options, (option) => {
      option.style.display = this.searchMethod(option, searchStr) ? '' : 'none'
    })
    forEach(this.$list.querySelectorAll('bl-optgroup'), (group) => {
      const options = group.querySelectorAll('bl-option')
      group.style.display = every(options, (option) => option.style.display === 'none') ? 'none' : ''
    })
  }

  _initClickOutside() {
    if (!this._clearClickOutside) {
      this._clearClickOutside = onClickOutside([this, this.$popup], () => {
        if (this.$popup.open) {
          this.$popup.open = false
          this.$result.classList.remove('dropdown')
        }
      })
    }
  }

  _destroyClickOutside() {
    if (this._clearClickOutside) {
      this._clearClickOutside()
      this._clearClickOutside = undefined
    }
  }
}

if (!customElements.get('bl-select')) {
  customElements.define('bl-select', BlocksSelect)
}
