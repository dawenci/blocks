import type { BlocksButton } from '../button/index.js'
import type { ISelectResultComponent, ISelectableListComponent } from '../../common/connectSelectable.js'
import '../button/index.js'
import '../popup/index.js'
import { attr } from '../../decorators/attr.js'
import { compile } from '../../common/dateFormat.js'
import { computed } from '../../common/reactive.js'
import { connectSelectable } from '../../common/connectSelectable.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { fromAttr } from '../component/reactive.js'
import { inputTemplate, popupTemplate } from './template.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { padLeft } from '../../common/utils.js'
import { style } from './style.js'
import { BlocksDate } from '../date/index.js'
import { BlocksInput } from '../input/index.js'
import { BlocksPopup } from '../popup/index.js'
import { BlocksTime } from '../time/index.js'
import { Control } from '../base-control/index.js'

export interface BlocksDateTimePicker extends Control {
  $popup: BlocksPopup
  $date: BlocksDate
  $time: BlocksTime
  $timeValue: HTMLElement
  $confirmButton: BlocksButton
}

@defineClass({
  customElement: 'bl-datetime-picker',
  styles: [style],
})
export class BlocksDateTimePicker extends Control implements ISelectableListComponent {
  static override get observedAttributes() {
    return [
      ...BlocksPopup.observedAttributes,
      ...BlocksDate.observedAttributes,
      ...BlocksInput.observedAttributes,
      ...BlocksTime.observedAttributes,
    ]
  }

  static override get disableEventTypes(): readonly string[] {
    return ['click', 'touchstart', 'keydown']
  }

  @attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' }) accessor format!: string

  @attr('boolean') accessor open!: boolean

  @attr('string') accessor placeholder = '选择日期时间'

  @shadowRef('#content') accessor $content!: HTMLElement
  @shadowRef('[part="result"]') accessor $result!: HTMLInputElement & ISelectResultComponent
  @shadowRef('[part="result"]') accessor $input!: BlocksInput

  // model
  #value: Date | null = null

  #formatter = computed(format => compile(format), [fromAttr(this, 'format')])

  constructor() {
    super()

    this.appendShadowChild(inputTemplate())
    this._tabIndexFeature.withTabIndex(0)

    this.#setupPopup()
    this.#setupResult()

    connectSelectable(this.$input, this)
  }

  #disabledDate: BlocksDate['disabledDate']
  get disabledDate() {
    return this.#disabledDate
  }
  set disabledDate(value) {
    this.#disabledDate = value
  }

  #disabledHour: BlocksTime['disabledHour']
  get disabledHour() {
    return this.#disabledHour
  }
  set disabledHour(value) {
    this.#disabledHour = value
  }

  #disabledMinute: BlocksTime['disabledMinute']
  get disabledMinute() {
    return this.#disabledMinute
  }
  set disabledMinute(value) {
    this.#disabledMinute = value
  }

  #disabledSecond: BlocksTime['disabledSecond']
  get disabledSecond() {
    return this.#disabledSecond
  }
  set disabledSecond(value) {
    this.#disabledSecond = value
  }

  get value(): null | Date {
    return this.#value
  }

  set value(value: null | Date) {
    this.#value = value as null | Date
    if (this.open) {
      this.$date.selected = value === null ? [] : [value]
      this.#updateTimePanel(value)
      this.#renderResult()
    }
    dispatchEvent(this, 'change', {
      detail: { value },
    })
  }

  // 实现 ISelectableListComponent 的事件
  #notifyDateChange(value: Date | null) {
    if (value === null) {
      dispatchEvent(this, 'select-list:change', { detail: { value: [] } })
    } else {
      const selected = [
        {
          label: this.#formatter.content(value),
          value,
        },
      ]
      dispatchEvent(this, 'select-list:change', { detail: { value: selected } })
    }
    dispatchEvent(this, 'change', {
      detail: { value: this.#value },
    })
  }

  // ISelectableListComponent
  clearSelected(): void {
    console.log('clear selected')
    this.#value = null
    this.$date.selected = []
    this.#updateTimePanel(null)
    this.#renderResult()
  }

  #setupPopup() {
    this.$popup = popupTemplate() as BlocksPopup & ISelectableListComponent
    this.$date = this.$popup.querySelector('bl-date')!
    this.$time = this.$popup.querySelector('bl-time')!
    this.$timeValue = this.$popup.querySelector('#time-value') as HTMLElement
    this.$confirmButton = this.$popup.querySelector('bl-button')!
    this.$popup.anchorElement = () => this

    this.$input.onfocus = this.$input.onclick = () => {
      this.open = true
    }

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

    this.onConnected(() => {
      document.body.appendChild(this.$popup)
    })
    this.onDisconnected(() => {
      document.body.removeChild(this.$popup)
    })

    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksPopup.observedAttributes.includes(attrName as any)) {
        if (attrName === 'open') {
          this.$popup.open = this.open
        } else {
          this.$popup.setAttribute(attrName, newValue as string)
        }
      }
    })

    this.#setupDateTime()
  }

  #setupDateTime() {
    // 弹出面板时，将 model 值设置到 date、time 面板上
    this.$popup.addEventListener('opened', () => {
      this.$date.selected = this.#value === null ? [] : [this.#value]
      this.#updateTimePanel(this.#value)
      // update layout
      this.$time.style.height = this.$date.$content.offsetHeight + 'px'
      this.$timeValue.style.height = this.$date.offsetHeight - this.$date.$content.offsetHeight - 1 + 'px'
    })

    // 点击确定按钮，提交值
    this.$confirmButton.onclick = () => {
      this.open = false
    }

    // 从 date、time 面板中提取时间
    const joinDateTime = (defaultDate: Date | null = null) => {
      let date = (this.$date.selected[0] ?? defaultDate) as Date | null
      if (date == null) return null
      date = copyDate(date)
      date.setHours(this.$time.hour ?? 0)
      date.setMinutes(this.$time.minute ?? 0)
      date.setSeconds(this.$time.second ?? 0)
      return date
    }

    this.$date.addEventListener('select-list:change', () => {
      const date = joinDateTime()
      this.#value = date
      this.#updateTimePanel(date)
      this.#renderResult()
      this.#notifyDateChange(date)
    })

    this.$time.addEventListener('change', () => {
      const date = joinDateTime(this.$time.hour || this.$time.minute || this.$time.second ? today() : null)
      this.#value = date
      this.$date.selected = date === null ? [] : [date]
      this.#renderResult()
      this.#notifyDateChange(date)
    })

    // 将对 time 面板的操作结果，实时刷新到 time 面板顶部
    const renderTimePanelTitle = () => {
      if (this.$time.hour == null) {
        this.$timeValue.textContent = ''
      } else {
        const h = padLeft('0', 2, String(this.$time.hour ?? 0))
        const m = padLeft('0', 2, String(this.$time.minute ?? 0))
        const s = padLeft('0', 2, String(this.$time.second ?? 0))
        this.$timeValue.textContent = `${h}:${m}:${s}`
      }
    }
    this.$time.addEventListener('change', renderTimePanelTitle)
    this.$date.addEventListener('change', renderTimePanelTitle)
    this.onRender(renderTimePanelTitle)

    this.onConnected(() => {
      this.#setDisabledMethods()
    })
    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksDate.observedAttributes.includes(attrName as any)) {
        this.$date.setAttribute(attrName, newValue as string)
      }
    })
    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksTime.observedAttributes.includes(attrName as any)) {
        this.$time.setAttribute(attrName, newValue as string)
      }
    })
  }

  #setupResult() {
    this.onConnected(() => {
      if (this.$input.placeholder == null) {
        this.$input.placeholder = '请选择日期'
      }
      if (!this.$input.suffixIcon) {
        this.$input.suffixIcon = 'time'
      }
    })

    this.onAttributeChanged((attrName, _, newValue) => {
      if (BlocksInput.observedAttributes.includes(attrName)) {
        if (attrName === 'value') {
          this.$input.value = newValue
        } else {
          this.$input.setAttribute(attrName, newValue as string)
        }
      }
    })
    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
  }

  // 更新 time 面板
  #updateTimePanel(date: Date | null) {
    const { $time } = this
    if (!date) {
      $time.hour = $time.minute = $time.second = null
      return
    }
    $time.hour = date.getHours()
    $time.minute = date.getMinutes()
    $time.second = date.getSeconds()
  }

  // popup append 后设置才有效
  #setDisabledMethods() {
    this.$date.disabledDate = (data, ctx) => {
      if (this.disabledDate && this.disabledDate(data, ctx)) {
        return true
      }
      return false
    }

    this.$time.disabledHour = (data, ctx) => {
      if (this.disabledHour && this.disabledHour(data, ctx)) {
        return true
      }
      return false
    }
    this.$time.disabledMinute = (data, ctx) => {
      if (this.disabledMinute && this.disabledMinute(data, ctx)) {
        return true
      }
      return false
    }
    this.$time.disabledSecond = (data, ctx) => {
      if (this.disabledSecond && this.disabledSecond(data, ctx)) {
        return true
      }
      return false
    }
  }

  #renderResult() {
    this.$input.value = this.#value ? this.#formatter.content(this.#value) : ''
  }

  #renderPlaceholder() {
    this.$input.placeholder = this.placeholder ?? '选择日期时间'
  }

  override render() {
    super.render()
    this.#renderResult()
    this.#renderPlaceholder()
  }
}

function copyDate(date: Date) {
  const copy = new Date()
  copy.setTime(date.getTime())
  return copy
}

function today() {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}
