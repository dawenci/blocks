import type { ISelected } from '../../common/connectSelectable.js'
import '../button/index.js'
import '../list/index.js'
import '../popup/index.js'
import './optgroup.js'
import './option.js'
import '../select-result/index.js'
import { confirmTemplate, popupTemplate, resultTemplate, slotTemplate } from './select.template.js'
import {
  PROXY_POPUP_ACCESSORS,
  PROXY_POPUP_ACCESSORS_KEBAB,
  PROXY_RESULT_ACCESSORS,
  PROXY_RESULT_ACCESSORS_KEBAB,
} from '../../common/constants.js'
import { connectSelectable, makeISelectableProxy } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { reactive, subscribe } from '../../common/reactive.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './select.style.js'
import { BlButton } from '../button/index.js'
import { BlList } from '../list/index.js'
import { BlOptGroup } from './optgroup.js'
import { BlOption } from './option.js'
import { BlPopup } from '../popup/index.js'
import { BlSelectResult } from '../select-result/index.js'
import { BlControl } from '../base-control/index.js'
import { SetupClickOutside } from '../setup-click-outside/index.js'

const isOption = ($el: Element): $el is BlOption => $el.tagName === 'BL-OPTION'
const isGroup = ($el: Element): $el is BlOptGroup => $el.tagName === 'BL-OPTGROUP'

export interface BlSelect
  extends BlControl,
    Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>,
    Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
  $popup: BlPopup
  $list: BlList
}

// TODO: 过滤时，剔除空的 group 标题（考虑实现）
@defineClass({
  customElement: 'bl-select',
  styles: [style],
  proxyAccessors: [
    { klass: BlPopup, names: PROXY_POPUP_ACCESSORS },
    { klass: BlSelectResult, names: PROXY_RESULT_ACCESSORS },
  ],
})
export class BlSelect extends BlControl {
  static override get observedAttributes() {
    return [...PROXY_RESULT_ACCESSORS_KEBAB, ...PROXY_POPUP_ACCESSORS_KEBAB]
  }

  static override get role() {
    return 'select'
  }

  @shadowRef('bl-select-result') accessor $result!: BlSelectResult
  @shadowRef('[part="slot"]') accessor $optionSlot!: HTMLSlotElement
  $list!: BlList
  $popup!: BlPopup
  $confirmButton?: BlButton

  _model = reactive<string[]>([], (a, b) => {
    return a.length === b.length && a.every(i => b.includes(i))
  })

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
    this.#setupAria()
  }

  selected: ISelected[] = []

  get options() {
    return Array.prototype.slice.call(this.querySelectorAll('bl-option'))
  }

  _clickOutside: SetupClickOutside<this> = SetupClickOutside.setup({
    component: this,
    target() {
      return [this, this.$popup]
    },
    update() {
      if (this.open) {
        this.open = false
      }
    },
    init() {
      this.hook.onAttributeChangedDep('open', () => {
        if (this.open) {
          this._clickOutside.bind()
        } else {
          this._clickOutside.unbind()
        }
      })
    },
  })

  #setupResult() {
    this.hook.onAttributeChangedDeps(PROXY_RESULT_ACCESSORS_KEBAB, (name, _, newValue) => {
      this.$result.setAttribute(name, newValue as string)
    })
  }

  #setupConnect() {
    const $proxy = makeISelectableProxy<string>()

    // 代理结果、选项之间的连接
    connectSelectable(this.$result, $proxy)
    connectSelectable($proxy, this.$list)

    // 处理 $date 面板发送过来的选中值
    $proxy.acceptSelected = selected => {
      this._model.content = selected.map(item => item.value)
      // afterResultAccepted
      if (!this.multiple) {
        this.open = false
      }
    }
    // 处理 $result 发送过来的取消选中项
    $proxy.deselect = selected => {
      this._model.content = this._model.content.filter(item => item !== selected.value)
    }
    // 处理 $result 发送过来的清空请求
    $proxy.clearSelected = () => {
      this._model.content = []
      // afterListClear
      this.open = false
      this.blur()
    }

    // model 更新时，分别同步到 $result / $date，刷新 $date 面板，触发 change
    subscribe(this._model, values => {
      const selected = values.map(value => {
        const item = this.$list.getVirtualItemByKey(value).data as { value: string; label: string }
        const label = item.label
        return { value, label }
      })

      // 同步结果到 bl-option
      this.options.forEach($option => {
        const selected = values.some(item => String(item) === $option.getAttribute('value'))
        if ($option.silentSelected) {
          $option.silentSelected(selected)
        } else {
          if (selected) {
            $option.setAttribute('selected', '')
          } else {
            $option.removeAttribute('selected')
          }
        }
      })

      this.$result.acceptSelected(selected)
      this.$list.checked = values

      // TODO, scroll list to last checked item ?
      const value = !this.multiple ? values[0] ?? null : values
      dispatchEvent(this, 'change', { detail: { value } })
    })
  }

  #setupPopup() {
    this.$popup = popupTemplate()
    this.$popup.anchorElement = () => this

    this.hook.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })

    this.hook.onAttributeChangedDeps(PROXY_POPUP_ACCESSORS_KEBAB, (name, _, newValue) => {
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

    {
      // 标记该次 focus 是点击了 clear 按钮触发的
      // 点击 clear 按钮，无需弹出弹窗
      let isClickClear = false
      const onClearStart = () => {
        isClickClear = true
      }
      const onFocus = () => {
        if (!isClickClear) this.open = true
        isClickClear = false
      }
      const onClearEnd = () => {
        isClickClear = false
      }
      this.hook.onConnected(() => {
        // 触发顺序：mousedown-clear -> focus -> click-clear
        this.addEventListener('mousedown-clear', onClearStart)
        this.addEventListener('focus', onFocus)
        this.addEventListener('click-clear', onClearEnd)
      })
      this.hook.onDisconnected(() => {
        this.removeEventListener('mousedown-clear', onClearStart)
        this.removeEventListener('focus', onFocus)
        this.removeEventListener('click-clear', onClearEnd)
      })
    }

    this.hook.onAttributeChangedDep('open', () => {
      const { $popup } = this
      if (this.open) {
        $popup.style.minWidth = `${this.offsetWidth}px`
        this.$result.classList.add('dropdown')
        // this.focus()
      } else {
        this.$result.classList.remove('dropdown')
        this.blur()
      }
    })
  }

  #setupSelectableList() {
    this.$list = this.$popup.querySelector<BlList>('.option-list')!

    const updateMultiple = () => {
      this.$list.multiple = this.$result.multiple = this.multiple
    }
    updateMultiple()
    this.hook.onAttributeChangedDep('multiple', updateMultiple)

    this.$popup.addEventListener('closed', () => {
      this.$result.clearSearch()
    })
  }

  #setupConfirm() {
    const render = () => {
      if (this.$result.multiple) {
        if (!this.$confirmButton) {
          this.$confirmButton = this.$popup.appendChild(confirmTemplate())
          this.$confirmButton.onclick = () => {
            this.open = false
          }
        }
      } else {
        if (this.$confirmButton) {
          this.$popup.removeChild(this.$confirmButton)
          this.$confirmButton = undefined
        }
      }
    }
    this.hook.onRender(render)
    this.hook.onConnected(render)
    this.hook.onAttributeChangedDep('multiple', render)
  }

  #setupOptions() {
    // group 渲染支持
    const _render = BlList.prototype.itemRender
    this.$list.itemRender = function (this: BlList, $item: HTMLElement, vitem: any) {
      _render.call(this, $item, vitem)
      if (vitem.data.value.startsWith('__group_')) {
        $item.style.backgroundColor = 'transparent'
        $item.querySelector<HTMLElement>('.label')!.style.paddingLeft = ''
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
        this._model.content = selected
      }
    }

    this.hook.onConnected(syncOptions)
    this.$optionSlot.addEventListener('slotchange', syncOptions)

    // 处理 option 冒泡发出的 select/deselect 事件
    const onSelectOption = (e: Event) => {
      const target = e.target as BlOption
      const value = target.getAttribute('value')
      if (!value) return
      if (this.multiple) {
        this._model.content = this._model.content.concat([value])
      } else {
        this._model.content = [value]
      }
    }
    const onDeselectOption = (e: Event) => {
      const target = e.target as BlOption
      const value = target.getAttribute('value')
      if (!value) return
      this._model.content = this._model.content.filter(item => String(item) !== value)
    }
    this.hook.onConnected(() => {
      this.addEventListener('select', onSelectOption)
      this.addEventListener('deselect', onDeselectOption)
    })
    this.hook.onDisconnected(() => {
      this.removeEventListener('select', onSelectOption)
      this.removeEventListener('deselect', onDeselectOption)
    })
  }

  #setupKeymap() {
    // 在 result 上按 tab、上下方向键，foucs 第一个选项
    this.onkeydown = e => {
      if (e.key === 'Escape') {
        this.open = false
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
        this.open = false
      }
    }
  }

  // 标记 BlOption 的选中状态
  selectOption($option: BlOption) {
    if ($option.disabled) return
    // 整 group 禁用
    if ($option.parentElement instanceof BlOptGroup && $option.parentElement.disabled) {
      return
    }
    if (this.$result.multiple) {
      $option.selected = !$option.selected
    } else {
      const selected = this.$list.querySelector('[selected]') as BlOption
      if (selected && selected !== $option) {
        selected.selected = false
      }
      $option.selected = true
    }
  }

  #setupAria() {
    this.hook.onConnected(() => {
      this.setAttribute('aria-haspopup', 'listbox')
    })
  }
}
