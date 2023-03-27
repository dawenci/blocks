import type { ISelected } from '../../common/connectSelectable.js'
import '../list/index.js'
import '../input/index.js'
import './optgroup.js'
import './option.js'
import '../popup/index.js'
import '../select-result/index.js'
import { attr } from '../../decorators/attr.js'
import { boolGetter } from '../../common/property.js'
import { connectSelectable } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass.js'
import { onceEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { popupTemplate, slotTemplate, resultTemplate } from './select.template.js'
import { style } from './select.style.js'
import { BlocksButton } from '../button/index.js'
import { BlocksList } from '../list/index.js'
import { BlocksOptGroup } from './optgroup.js'
import { BlocksOption } from './option.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksSelectResult } from '../select-result/index.js'
import { Control } from '../base-control/index.js'

const isOption = ($el: Element): $el is BlocksOption => $el.tagName === 'BL-OPTION'
const isGroup = ($el: Element): $el is BlocksOptGroup => $el.tagName === 'BL-OPTGROUP'

export interface BlocksSelect extends Control {
  $popup: BlocksPopup
  $list: BlocksList
}

// TODO: 初始化选中项，打开候选列表时候没有渲染选中状态的问题待解决
@defineClass({
  customElement: 'bl-select',
  styles: [style],
})
export class BlocksSelect extends Control {
  static override get observedAttributes() {
    return [...BlocksSelectResult.observedAttributes, ...BlocksPopup.observedAttributes]
  }

  static get role() {
    return 'select'
  }

  static override get disableEventTypes() {
    return ['click', 'keydown', 'touchstart']
  }

  @attr('boolean') accessor open!: boolean

  @shadowRef('bl-select-result') accessor $result!: BlocksSelectResult
  @shadowRef('[part="slot"]') accessor $optionSlot!: HTMLSlotElement
  $list!: BlocksList
  $popup!: BlocksPopup
  $confirmButton?: BlocksButton

  constructor() {
    super()

    this.appendShadowChildren([resultTemplate(), slotTemplate()])
    this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex('0')

    this.#setupResult()
    this.#setupPopup()
    this.#setupSelectableList()
    this.#setupOptions()
    this.#setupConfirm()
    this.#setupKeymap()
    this.#setupConnect()
  }

  selected: ISelected[] = []

  get options() {
    return Array.prototype.slice.call(this.querySelectorAll('bl-option'))
  }

  #setupResult() {
    this.$result.suffixIcon = 'down'
    this.onAttributeChangedDeps(BlocksSelectResult.observedAttributes, (name, _, newValue) => {
      this.$result.setAttribute(name, newValue as string)
    })
  }

  #setupConnect() {
    // 连接选择结果面板和候选列表
    let clearConnection: () => void
    this.onConnected(() => {
      clearConnection = connectSelectable(this.$result, this.$list, {
        afterHandleListChange: selected => {
          // 单选模式，选择结果后，自动关闭
          if (!this.$result.multiple) {
            this.open = false
            this.$result.classList.remove('dropdown')
          }
          // 同步结果到 bl-option
          this.options.forEach($option => {
            $option.silentSelected(selected.some(item => item.value === $option.value))
          })
        },
        afterHandleResultClear: () => {
          this._closePopup()
        },
      })
    })
    this.onDisconnected(() => {
      clearConnection()
    })
  }

  #setupPopup() {
    this.$popup = popupTemplate()

    this.onAttributeChangedDeps(BlocksPopup.observedAttributes, (name, _, newValue) => {
      if (name === 'open') {
        // 首次打开的时候，挂载 $popup 的 DOM
        if (this.open && !document.body.contains(this.$popup)) {
          document.body.appendChild(this.$popup)
        }
        this.$popup.open = this.open
      } else {
        this.$popup.setAttribute(name, newValue as string)
      }
    })
    this.$popup.anchorElement = () => this
    this.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })

    {
      // 标记该次 focus 是点击了 clear 按钮触发的
      // 点击 clear 按钮，无需弹出弹窗
      let isClickClear = false
      const onClearStart = () => {
        isClickClear = true
      }
      const onFocus = () => {
        if (!isClickClear) this._openPopup()
        isClickClear = false
      }
      const onClearEnd = () => {
        isClickClear = false
      }
      this.onConnected(() => {
        // 触发顺序：mousedown-clear -> focus -> click-clear
        this.addEventListener('mousedown-clear', onClearStart)
        this.addEventListener('focus', onFocus)
        this.addEventListener('click-clear', onClearEnd)
      })
      this.onDisconnected(() => {
        this.removeEventListener('mousedown-clear', onClearStart)
        this.removeEventListener('focus', onFocus)
        this.removeEventListener('click-clear', onClearEnd)
      })
    }

    let clear: (() => void) | undefined
    const initClickOutside = () => {
      if (!clear) {
        clear = onClickOutside([this, this.$popup], () => {
          if (this.open) {
            this.open = false
            this.$result.classList.remove('dropdown')
          }
        })
      }
    }
    const destroyClickOutside = () => {
      if (clear) {
        clear()
        clear = undefined
      }
    }
    this.$popup.addEventListener('opened', () => {
      initClickOutside()
    })
    this.$popup.addEventListener('closed', () => {
      destroyClickOutside()
    })

    this.onDisconnected(() => {
      destroyClickOutside()
    })
  }
  _openPopup() {
    const { $popup } = this
    $popup.style.minWidth = `${this.offsetWidth}px`
    this.open = true
    this.$result.classList.add('dropdown')
    // this.focus()
  }

  _closePopup() {
    this.open = false
    this.$result.classList.remove('dropdown')
    this.blur()
  }

  #setupSelectableList() {
    this.$list = this.$popup.querySelector<BlocksList>('.option-list')!

    const updateMultiple = () => {
      this.$list.multiple = boolGetter('multiple')(this)
      this.$result.multiple = boolGetter('multiple')(this)
    }
    updateMultiple()
    this.onAttributeChangedDep('multiple', updateMultiple)

    this.$popup.addEventListener('closed', () => {
      this.$result.clearSearch()
    })
  }

  #setupConfirm() {
    const render = () => {
      if (this.$result.multiple) {
        if (!this.$confirmButton) {
          this.$confirmButton = this.$popup.appendChild(document.createElement('bl-button'))
          this.$confirmButton.type = 'primary'
          this.$confirmButton.size = 'small'
          this.$confirmButton.innerText = '确定'
          this.$confirmButton.block = true
          this.$confirmButton.style.cssText = `margin:8px`
          this.$confirmButton.onclick = () => this._closePopup()
        }
      } else {
        if (this.$confirmButton) {
          this.$popup.removeChild(this.$confirmButton)
          this.$confirmButton = undefined
        }
      }
    }
    this.onRender(render)
    this.onConnected(render)
    this.onAttributeChangedDep('multiple', render)
  }

  #setupOptions() {
    // group 渲染支持
    const _render = BlocksList.prototype.itemRender
    this.$list.itemRender = function (this: BlocksList, $item: HTMLElement, vitem: any) {
      _render.call(this, $item, vitem)
      if (vitem.data.value.startsWith('__group_')) {
        $item.style.backgroundColor = 'transparent'
      } else {
        $item.querySelector<HTMLElement>('.label')!.style.paddingLeft = '24px'
      }
    }

    // 同步 bl-group/bl-option <-> list data
    const syncOptions = () => {
      const $element = this.$optionSlot.assignedElements()
      const options: { value: string; label: string; disabled: boolean }[] = []
      const selected: string[] = []
      const collect = (list: ArrayLike<Element>, isDisabled = false) => {
        for (let i = 0; i < list.length; ++i) {
          const $el = list[i]
          if (isGroup($el)) {
            const label = $el.getAttribute('label') ?? 'group'
            const value = `__group_` + label
            const disabled = true
            options.push({ label, value, disabled })
            collect($el.children, $el.hasAttribute('disabled'))
          } else if (isOption($el)) {
            const value = $el.getAttribute('value') || ''
            const label = $el.getAttribute('label') || $el.innerText || value
            const disabled = isDisabled || $el.hasAttribute('disabled')
            const data = { label, value, disabled }
            options.push(data)
            if ($el.hasAttribute('selected')) {
              selected.push(data.value)
            }
          }
        }
      }
      collect($element)
      this.$list.data = options
      if (selected.length) {
        onceEvent(this.$list, 'data-bound', () => {
          this.$list.checked = selected
        })
      }
    }

    this.onConnected(syncOptions)
    this.$optionSlot.addEventListener('slotchange', syncOptions)

    // 处理 option 冒泡发出的 select/deselect 事件
    const onSelectOption = (e: Event) => {
      const target = e.target as BlocksOption
      const data: ISelected = { value: target.value, label: target.label ?? target.value ?? '' }
      this.$list.select(data)
    }
    const onDeselectOption = (e: Event) => {
      const target = e.target as BlocksOption
      const data: ISelected = { value: target.value, label: target.label ?? target.value ?? '' }
      this.$list.deselect(data)
    }
    this.onConnected(() => {
      this.addEventListener('select', onSelectOption)
      this.addEventListener('deselect', onDeselectOption)
    })
    this.onDisconnected(() => {
      this.removeEventListener('select', onSelectOption)
      this.removeEventListener('deselect', onDeselectOption)
    })
  }

  #setupKeymap() {
    // 在 result 上按 tab、上下方向键，foucs 第一个选项
    this.onkeydown = e => {
      if (e.key === 'Escape') {
        this._closePopup()
      }

      if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        this.$list.focus()
        this.$list.focusNext()
      }
    }

    // 在 list 上按上下方向键，上下移动焦点
    this.$list.onkeydown = e => {
      if (e.key === 'Escape') {
        this.$list.blur()
        this._closePopup()
      }
    }
  }

  // 标记 BlocksOption 的选中状态
  selectOption($option: BlocksOption) {
    if ($option.disabled) return
    // 整 group 禁用
    if ($option.parentElement instanceof BlocksOptGroup && $option.parentElement.disabled) {
      return
    }
    if (this.$result.multiple) {
      $option.selected = !$option.selected
    } else {
      const selected = this.$list.querySelector('[selected]') as BlocksOption
      if (selected && selected !== $option) {
        selected.selected = false
      }
      $option.selected = true
    }
  }
}
