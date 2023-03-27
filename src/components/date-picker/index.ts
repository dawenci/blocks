import type { BlocksButton } from '../button/index.js'
import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js'
import type { EnumAttr } from '../../decorators/attr.js'
import { attr } from '../../decorators/attr.js'
import { connectSelectable } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { popupTemplate, resultTemplate } from './template.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { style } from './style.js'
import { BlocksDate } from '../date/index.js'
import { BlocksSelectResult } from '../select-result/index.js'
import { BlocksPopup } from '../popup/index.js'
import { Control } from '../base-control/index.js'

interface DatePickerEventMap extends ComponentEventMap {
  change: CustomEvent<{ value: any }>
  closed: CustomEvent
  opened: CustomEvent
}

export interface BlocksDatePicker extends Control {
  $popup: BlocksPopup
  $date: BlocksDate
  $confirmButton: BlocksButton

  addEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: ComponentEventListener<DatePickerEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof DatePickerEventMap>(
    type: K,
    listener: ComponentEventListener<DatePickerEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-date-picker',
  styles: [style],
})
export class BlocksDatePicker extends Control {
  static override get observedAttributes() {
    return [
      ...BlocksPopup.observedAttributes,
      ...BlocksDate.observedAttributes,
      ...BlocksSelectResult.observedAttributes,
    ]
  }

  static override get disableEventTypes(): readonly string[] {
    return ['click', 'touchstart', 'keydown']
  }

  @attr('string', { defaults: 'YYYY-MM-DD' }) accessor format!: string

  @attr('boolean') accessor open!: boolean

  /** 选择模式，支持 single, multiple */
  @attr('enum', { enumValues: ['single', 'multiple'] })
  accessor mode: EnumAttr<['single', 'multiple']> = 'single'

  @shadowRef('#result') accessor $result!: BlocksSelectResult

  constructor() {
    super()

    this.appendShadowChild(resultTemplate())
    this._tabIndexFeature.withTarget(() => [this.$result]).withTabIndex(0)

    this.#setupPopup()
    this.#setupResult()

    connectSelectable(this.$result, this.$date, {
      afterHandleListChange: () => {
        if (this.mode === 'single') {
          this.open = false
        }
      },
      afterHandleResultClear: () => {
        this.open = false
        this.blur()
      },
    })
  }

  get value(): Date | null {
    return this.$result.value as Date | null
  }
  set value(value: Date | null) {
    if (value) {
      this.$date.showValue(value)
      this.$date.selectByDate(value)
    } else {
      this.$date.selected = []
    }
  }
  get values(): Date[] {
    return this.$result.values
  }
  set values(values: Date[]) {
    this.$date.selected = values
  }

  get disabledDate() {
    return this.$date.disabledDate
  }

  set disabledDate(value) {
    this.$date.disabledDate = value
  }

  #setupResult() {
    this.onConnected(() => {
      if (this.$result.placeholder == null) {
        this.$result.placeholder = '请选择日期'
      }
    })
    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksSelectResult.observedAttributes.includes(attrName)) {
        this.$result.setAttribute(attrName, newValue as string)
      }
      if (attrName === 'mode') {
        this.$result.multiple = newValue === 'multiple'
      }
    })
    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
    this.onAttributeChangedDep('format', () => {
      this.$date.notifySelectListChange()
    })
  }

  #setupPopup() {
    // DOM 准备
    this.$popup = popupTemplate()
    this.$date = this.$popup.querySelector('bl-date')!
    this.$confirmButton = this.$popup.querySelector('bl-button')!

    // Popup 初始化
    this.$popup.anchorElement = () => this.$result

    // 标记该次 focus 是点击了 clear 按钮触发的
    // 点击 clear 按钮，无需弹出弹窗
    let isClickClear = false
    const onClearStart = () => {
      isClickClear = true
    }
    const onFocus = () => {
      if (!isClickClear) {
        // 打开 popup 前，如果 date 有值则切换视图到最后一个值所在日期面板
        if (!this.open) {
          this.$date.showValue(this.$date.selected[this.$date.selected.length - 1] ?? new Date())
        }
        this.open = true
      }
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

    this.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })
    this.onAttributeChanged((name, _, val) => {
      if (BlocksPopup.observedAttributes.includes(name as any)) {
        if (name === 'open') {
          // 首次打开的时候，挂载 $popup 的 DOM
          if (this.open && !document.body.contains(this.$popup)) {
            document.body.appendChild(this.$popup)
          }
          this.$popup.open = this.open
        } else {
          this.$popup.setAttribute(name, val as string)
        }
      }
    })

    // 点击 popup 外边，隐藏 popup
    {
      let clear: (() => void) | undefined
      const eventStart = () => {
        if (!clear) {
          clear = onClickOutside([this, this.$popup], () => {
            if (this.open) {
              this.$date.clearUncompleteRange()
              this.open = false
            }
          })
        }
      }
      const eventStop = () => {
        if (clear) {
          clear()
          clear = undefined
        }
      }
      this.onConnected(() => {
        this.$popup.addEventListener('opened', eventStart)
        this.$popup.addEventListener('closed', eventStop)
      })
      this.onDisconnected(() => {
        this.$popup.removeEventListener('opened', eventStart)
        this.$popup.removeEventListener('closed', eventStop)
      })
      this.onDisconnected(eventStop)
    }
    // 代理 popup 事件
    {
      const onOpened = () => {
        dispatchEvent(this, 'opened')
      }
      const onClosed = () => {
        dispatchEvent(this, 'closed')
      }
      this.onConnected(() => {
        this.$popup.addEventListener('opened', onOpened)
        this.$popup.addEventListener('closed', onClosed)
      })
      this.onDisconnected(() => {
        this.$popup.removeEventListener('opened', onOpened)
        this.$popup.removeEventListener('closed', onClosed)
      })
    }

    this.#setupDate()
    this.#setupConfirm()
  }

  #setupDate() {
    const reEmitChange = () => {
      if (this.$date.mode !== 'multiple') {
        dispatchEvent(this, 'change', { detail: { value: this.value } })
      }
    }
    this.onConnected(() => {
      this.$date.addEventListener('change', reEmitChange)
    })
    this.onDisconnected(() => {
      this.$date.removeEventListener('change', reEmitChange)
    })

    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksDate.observedAttributes.includes(attrName as any)) {
        this.$date.setAttribute(attrName, newValue as string)
      }
    })
  }

  #setupConfirm() {
    // 点击确定按钮初始化
    const onClickConfirm = () => {
      dispatchEvent(this, 'change', { detail: { value: this.value } })
      this.render()
      this.open = false
    }
    // 多个结果时，显示“确定按钮”
    const renderAction = () => {
      const val = this.$date.mode
      this.$popup.querySelector<HTMLElement>('#action')!.style.display = val === 'multiple' ? 'block' : 'none'
    }
    this.$popup.onConnected(renderAction)
    this.$date.onAttributeChangedDep('mode', renderAction)
    this.onConnected(() => {
      this.$confirmButton.onclick = onClickConfirm
    })
    this.onDisconnected(() => {
      this.$confirmButton.onclick = null
    })
  }
}
