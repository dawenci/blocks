import './optgroup.js'
import './option.js'
import '../popup/index.js'
import '../input/index.js'
import '../select-result/index.js'
import { intGetter, intSetter } from '../../common/property.js'
import { every, find, forEach, findIndex } from '../../common/utils.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import {
  styleTemplate,
  slotTemplate,
  popupTemplate,
} from './select-template.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksSelectResult } from '../select-result/index.js'
import { BlocksOption } from './option.js'
import { BlocksOptGroup } from './optgroup.js'
import { cloneElement } from '../../common/cloneElement.js'
import {
  ISelected,
  connectSelectable,
  ISelectableListComponent,
} from '../../common/connectSelectable.js'
import { dispatchEvent } from '../../common/event.js'
import { customElement } from '../../decorators/customElement.js'
import { applyStyle } from '../../decorators/style.js'

const isOption = ($el: Element): $el is BlocksOption =>
  $el instanceof BlocksOption
const isGroup = ($el: Element): $el is BlocksOptGroup =>
  $el instanceof BlocksOptGroup

export interface BlocksSelect extends BlocksSelectResult {
  _ref: BlocksSelectResult['_ref'] & {
    $optionSlot: HTMLSlotElement
    $popup: BlocksPopup
    $list: HTMLElement
  }
}

@customElement('bl-select')
export class BlocksSelect extends BlocksSelectResult {
  static override get observedAttributes() {
    return BlocksSelectResult.observedAttributes.concat([])
  }

  static get role() {
    return 'select'
  }

  constructor() {
    super()

    const $style = styleTemplate()
    const $optionSlot = slotTemplate()
    const $popup = popupTemplate()
    const $list = $popup.querySelector(
      '.option-list'
    ) as ISelectableListComponent

    this._ref.$optionSlot = $optionSlot
    this._ref.$popup = $popup
    this._ref.$list = $list

    this._ref.$popup.anchor = () => this

    this._appendStyle($style)
    this.shadowRoot!.appendChild($optionSlot)

    this.onfocus = () => {
      this._openPopup()
    }

    $list.onclick = e => {
      const $target = e.target as HTMLElement
      if (isOption($target)) {
        this._selectOption($target)
      }
      this.render()
    }

    // 让 $list 实现 ISelectableListComponent 的事件
    $list.addEventListener('select', e => {
      const target = e.target as BlocksOption
      const data = { value: target.value, label: target.label }
      dispatchEvent($list, 'select-list:select', { detail: { value: data } })
    })

    // 让 $list 实现 ISelectableListComponent 的事件
    $list.addEventListener('deselect', e => {
      const target = e.target as BlocksOption
      const data = { value: target.value, label: target.label }
      dispatchEvent($list, 'select-list:deselect', { detail: { value: data } })
    })

    // 让 $list 实现 ISelectableListComponent 的方法
    $list.clearSelected = () => {
      this.clearValue()
      this.clearSearch()
      this.render()
    }
    // 让 $list 实现 ISelectableListComponent 的方法
    $list.deselect = (selected: ISelected) => {
      const $selected = find(
        this.options,
        option => option.value === selected.value
      )
      if ($selected) $selected.selected = false
    }
    // 让 $list 实现 ISelectableListComponent 的方法
    $list.searchSelectable = (searchString: string) => {
      this.searchString = searchString
      this.filter()
    }
    // 连接选择结果面板和候选列表
    connectSelectable(this, $list)

    $popup.addEventListener('opened', () => {
      this.#initClickOutside()
    })

    $popup.addEventListener('closed', () => {
      this.clearSearch()
      this.#destroyClickOutside()
    })

    $optionSlot.addEventListener('slotchange', () => {
      this.#initOptions()
    })

    this.suffixIcon = 'down'

    this.#initKeymap()
  }

  searchString = ''

  get selectedOptions() {
    return this.value
  }

  set selectedOptions(value) {
    this.value = value
    const valueMap = Object.create(null)
    const values = this.getValues()
    values.forEach(item => {
      valueMap[item.value] = true
    })
    forEach(this.options, option => {
      option.silentSelected(!!valueMap[option.value])
    })
  }

  #optionFilter?: (option: any, searchString: string) => boolean
  get optionFilter() {
    if (this.#optionFilter) {
      return this.#optionFilter
    }
    return (option: any, searchString: string) =>
      (option.label ?? option.textContent).includes(searchString)
  }

  set optionFilter(value) {
    if (typeof value !== 'function') return
    this.#optionFilter = value
  }

  get options() {
    return Array.prototype.slice.call(
      this._ref.$list.querySelectorAll('bl-option')
    )
  }

  override select(selected: ISelected) {
    super.select(selected)
    // 单选模式
    if (!this.multiple) {
      this._ref.$popup.open = false
      this.classList.remove('dropdown')
    }
  }

  _openPopup() {
    const { $popup } = this._ref
    $popup.style.minWidth = `${this.offsetWidth}px`
    $popup.open = true
    this.classList.add('dropdown')
    this.focus()
  }

  _closePopup() {
    this._ref.$popup.open = false
    this.classList.remove('dropdown')
    this.blur()
  }

  override clearValue() {
    super.clearValue()
    this._ref.$optionSlot.assignedElements().forEach($option => {
      if (isOption($option)) {
        $option.silentSelected(false)
      }
    })

    this._ref.$list
      .querySelectorAll<BlocksOption>('[selected]')
      .forEach($option => {
        $option.silentSelected(false)
      })

    this._renderValue()
  }

  override connectedCallback() {
    document.body.appendChild(this._ref.$popup)
    super.connectedCallback()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.body.removeChild(this._ref.$popup)
    this.#destroyClickOutside()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
  }

  #initOptions() {
    this._ref.$list.innerHTML = ''

    // 将 slot 传入的 option 等拷贝到 popup 里
    this._ref.$optionSlot.assignedElements().forEach(el => {
      if (isOption(el) || isGroup(el)) {
        const copy = cloneElement(el)
        if (isOption(copy)) {
          copy.setAttribute('tabindex', '0')
        }
        if (copy.id) {
          copy.removeAttribute('id')
        }
        this._ref.$list.appendChild(copy)
      }
    })
  }

  _selectOption(option: BlocksOption) {
    if (option.disabled) return
    // 整 group 禁用
    if (
      option.parentElement instanceof BlocksOptGroup &&
      option.parentElement.disabled
    ) {
      return
    }
    if (this.multiple) {
      option.selected = !option.selected
    } else {
      const selected = this._ref.$list.querySelector(
        '[selected]'
      ) as BlocksOption
      if (selected && selected !== option) {
        selected.selected = false
      }
      option.selected = true
    }
  }

  // TODO, group 无效解决
  #initKeymap() {
    // 快捷键控制焦点移动
    let currentFocusValue: any
    const focusPrev = () => {
      const all = this.options.filter(el => !el.disabled)
      if (!all.length) return
      const index = findIndex(all, item => item.value === currentFocusValue)
      const prev = all[index - 1] ?? all[all.length - 1]
      if (prev) {
        currentFocusValue = prev.value
        prev.focus()
      }
    }

    const focusNext = () => {
      const all = this.options.filter(el => !el.disabled)
      if (!all.length) return
      const index = findIndex(all, item => item.value === currentFocusValue)
      const next = all[index + 1] ?? all[0]
      if (next) {
        currentFocusValue = next.value
        next.focus()
      }
    }

    // 在 result 上按 tab、上下方向键，foucs 第一个选项
    this.onkeydown = e => {
      if (e.key === 'Escape') {
        this._closePopup()
      }
      if (
        (e.key === 'Tab' && !e.shiftKey) ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp'
      ) {
        e.preventDefault()
        const first = this.options.find($option => !$option.disabled)
        if (first) {
          currentFocusValue = first.value
          first.focus()
        }
      }
    }

    // 在 list 上按 tab、shift + tab，上下方向键，上下移动焦点
    this._ref.$popup.onkeydown = e => {
      if (e.key === 'Escape') {
        this._closePopup()
      } else if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        focusNext()
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        focusPrev()
      } else if (e.key === ' ' || e.key === 'Enter') {
        const $option = this.options.find(
          item => item.value === currentFocusValue
        )
        if ($option) this._selectOption($option)
      }
    }
  }

  filter() {
    const searchString = this.searchString
    forEach(this.options, option => {
      option.style.display = this.optionFilter(option, searchString)
        ? ''
        : 'none'
    })
    forEach(this._ref.$list.querySelectorAll('bl-optgroup'), group => {
      const options = group.querySelectorAll('bl-option')
      group.style.display = every(
        options,
        option => option.style.display === 'none'
      )
        ? 'none'
        : ''
    })
  }

  #clearClickOutside?: () => void
  #initClickOutside() {
    if (!this.#clearClickOutside) {
      this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
        if (this._ref.$popup.open) {
          this._ref.$popup.open = false
          this.classList.remove('dropdown')
        }
      })
    }
  }

  #destroyClickOutside() {
    if (this.#clearClickOutside) {
      this.#clearClickOutside()
      this.#clearClickOutside = undefined
    }
  }
}
