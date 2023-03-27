import type { BlocksButton } from '../button/index.js'
import type { BlocksPopup } from '../popup/index.js'
import type { ISelectResultComponent } from '../../common/connectSelectable.js'
import '../button/index.js'
import '../popup/index.js'
import { attr } from '../../decorators/attr.js'
import { boolSetter } from '../../common/property.js'
import { compile } from '../../common/dateFormat.js'
import { computed } from '../../common/reactive.js'
import { contentTemplate, popupTemplate } from './template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { fromAttr } from '../component/reactive.js'
import { makeDate, makeDateFrom } from '../../common/date.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { padLeft } from '../../common/utils.js'
import { style } from './style.js'
import { BlocksDate } from '../date/index.js'
import { BlocksInput } from '../input/index.js'
import { PopupOrigin } from '../popup/index.js'
import { BlocksTime } from '../time/index.js'
import { ClearableControlBox } from '../base-clearable-control-box/index.js'

export interface BlocksDateTimeRangePicker extends ClearableControlBox {
  $popup: BlocksPopup
  $date: BlocksDate
  $time: BlocksTime
  $timeValue: HTMLElement
  $confirm: BlocksButton
}

@defineClass({
  customElement: 'bl-datetime-range-picker',
  styles: [style],
})
export class BlocksDateTimeRangePicker extends ClearableControlBox {
  @attr('string') accessor placeholderFrom = '选择日期时间'

  @attr('string') accessor placeholderTo = '选择日期时间'

  @shadowRef('#content') accessor $content!: HTMLElement
  @shadowRef('[part="from"]') accessor $fromDate!: HTMLInputElement & ISelectResultComponent
  @shadowRef('[part="to"]') accessor $toDate!: HTMLInputElement & ISelectResultComponent

  @attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' }) accessor format!: string
  #formatter = computed(format => compile(format), [fromAttr(this, 'format')])

  // model
  #valueFrom: Date | null = null
  #valueTo: Date | null = null
  // 弹出日期、时间面板时，记录操作前的值，以便放弃操作时恢复
  #prevValueFrom: Date | null = null
  #prevValueTo: Date | null = null
  // 当前操作的是开始还是结束
  #activeInput: HTMLInputElement | null = null

  #clearClickOutside?: () => void

  constructor() {
    super()

    this.appendContent(contentTemplate())
    const $fromDate = this.$fromDate
    const $toDate = this.$toDate
    const $popup = popupTemplate()
    const $date = $popup.querySelector('bl-date')!
    const $time = $popup.querySelector('bl-time')!
    const $timeValue = $popup.querySelector('#time-value') as HTMLElement

    this.$popup = $popup
    this.$date = $date
    this.$time = $time
    this.$timeValue = $timeValue
    this.$confirm = $popup.querySelector('bl-button')!

    $popup.anchorElement = () => this

    const inputs = [$fromDate, $toDate]

    // 激活输入框时，
    // 1. 设置当前激活的上下文（是 from 还是 to），
    // 2. 打开日期时间面板，
    // 3. 同步 model 到面板
    const onfocus = (e: FocusEvent) => {
      if (this.disabled) return

      const $target = e.target as BlocksInput
      const $input = inputs.find($input => $input.contains($target)) ?? null

      if (!$popup.open) {
        $popup.open = true
      }
      this.#switchActiveInput($input)
    }
    inputs.forEach($input => {
      $input.addEventListener('focus', onfocus)
    })

    // 将日期、时间的选择结果写入 model
    const stage = (newValue: Date | null) => {
      this.activeValue = newValue
    }

    const discard = () => {
      this.#switchActiveInput(null)
      this.#valueFrom = this.#prevValueFrom
      this.#valueTo = this.#prevValueTo
      this.#prevValueFrom = this.#prevValueTo = null
      this.#renderResult()
      $date.selected = []
    }

    const commit = () => {
      if (this.#isFromActive()) {
        if (!this.#valueFrom) {
          // 左侧没有值，则也清空右侧
          this.#valueTo = null
        } else if (!this.#valueTo) {
          // 左侧选择了值，右侧没有值，则激活右侧选择
          this.#switchActiveInput($toDate)
          return
        }
      }
      if (this.#isToActive()) {
        if (!this.#valueTo) {
          // 右侧没有值，也清空左侧
          this.#valueFrom = null
        } else if (!this.#valueFrom) {
          // 右侧选择了值，左侧没有值，则激活左侧选择
          this.#switchActiveInput($fromDate)
          return
        }
      }

      this.#prevValueFrom = this.#prevValueTo = null
      dispatchEvent(this, 'change', {
        detail: {
          value: this.#valueFrom && this.#valueTo ? [this.#valueFrom, this.#valueTo] : null,
        },
      })
      this.$popup.open = false
    }

    $date.addEventListener('change', e => {
      if ($date.selectedCount) {
        const date = $date.selected[0]
        const newValue = copyDate(this.activeValue ?? today())
        newValue.setFullYear(date.getFullYear())
        newValue.setMonth(date.getMonth())
        newValue.setDate(date.getDate())
        stage(newValue)
        this.#renderResult()
        if (!$time.value) {
          this.#updateTimePanel(newValue)
        }
      } else {
        stage(null)
        this.#renderResult()
        if ($time.value) {
          this.#updateTimePanel(null)
        }
      }
    })

    $time.addEventListener('change', e => {
      const { hour, minute, second } = e.detail
      if (hour !== null && minute !== null && second !== null) {
        let newValue
        if (this.activeValue) {
          newValue = copyDate(this.activeValue)
        } else {
          // 对于区间模式，未选择 day，直接选择 time，
          // 则 day 部分优先采用另一侧的同一天，以便开始、结束日期大小非法时进行自动修正
          newValue = copyDate(this.#valueFrom ?? this.#valueTo ?? today())
        }
        newValue.setHours(hour)
        newValue.setMinutes(minute)
        newValue.setSeconds(second)
        stage(newValue)
        this.#renderResult()
        if (!$date.selectedCount) {
          this.#updateDatePanel(newValue)
        }
      } else {
        stage(null)
        this.#renderResult()
        if ($date.selectedCount) {
          this.#updateDatePanel(null)
        }
      }
    })

    // 将对 time 面板的操作结果，实时刷新到 time 面板顶部
    const renderTimePanelTitle = () => {
      if ($time.hour == null) {
        $timeValue.textContent = ''
      } else {
        const h = padLeft('0', 2, String($time.hour))
        const m = padLeft('0', 2, String($time.minute))
        const s = padLeft('0', 2, String($time.second))
        $timeValue.textContent = `${h}:${m}:${s}`
      }
    }
    $time.addEventListener('change', renderTimePanelTitle)

    $popup.addEventListener('open-changed', () => {
      boolSetter('popup-open')(this, $popup.open)
    })

    // 弹出面板时，将 model 值设置到 date、time 面板上
    $popup.addEventListener('opened', () => {
      this.#prevValueFrom = this.#valueFrom ?? null
      this.#prevValueTo = this.#valueTo ?? null
      const value = this.activeValue
      this.#updateDatePanel(value)
      this.#updateTimePanel(value)
      this.#updateLayout()
      this.#setupClickOutside()
      dispatchEvent(this, 'opened')
    })

    // 面板非点击确定而关闭时，舍弃值
    $popup.addEventListener('closed', () => {
      if (!this.#valueFrom || !this.#valueTo) {
        // 区间模式，值不完整，则撤销
        discard()
      }
      this.#switchActiveInput(null)
      this.#destroyClickOutside()
      dispatchEvent(this, 'closed')
    })

    this.$confirm.onclick = () => {
      commit()
    }

    this.addEventListener('click-clear', () => {
      this.#valueFrom = this.#valueTo = null
      this.#switchActiveInput(null)
      dispatchEvent(this, 'change', {
        detail: { value: null },
      })

      this.render()
    })

    this.onConnected(() => {
      if (!this.suffixIcon) {
        this.suffixIcon = 'time'
      }
      document.body.appendChild(this.$popup)
      this.#setDisabledMethods()
      this.render()
    })

    this.onDisconnected(() => {
      document.body.removeChild(this.$popup)
      this.#destroyClickOutside()
    })

    this.onAttributeChanged((name: any, _: any, val: any) => {
      if (BlocksDate.observedAttributes.includes(name) && name !== 'mode') {
        this.$date.setAttribute(name, val)
      }
      this.render()
    })
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

  get activeValue() {
    if (this.#isFromActive()) {
      return this.#valueFrom
    } else {
      return this.#valueTo
    }
  }

  set activeValue(value: Date | null) {
    const isFromActive = this.#isFromActive()
    if (isFromActive) {
      this.#valueFrom = value
    } else {
      this.#valueTo = value
    }
    // 按钮 disabled 校验只做 date 面板
    // time 面板不限制，但是一旦出现开始时间大于结束时间（date 面板为同一天时有可能）这种非法值，
    // 则需要自动纠正：自动调整另一侧的 time 部分
    if (this.#valueFrom && this.#valueTo && this.#valueFrom?.getTime() > this.#valueTo.getTime()) {
      if (isFromActive) {
        this.#valueTo.setTime(this.#valueFrom.getTime())
      } else {
        this.#valueFrom.setTime(this.#valueTo.getTime())
      }
    }
  }

  get value(): null | Date | [Date, Date] {
    if (this.#valueFrom && this.#valueTo) {
      return [this.#valueFrom, this.#valueTo]
    } else {
      return null
    }
  }

  set value(value: null | Date | [Date, Date]) {
    if (value == null) {
      this.#valueFrom = this.#valueTo = null
      this.#switchActiveInput(null)
      dispatchEvent(this, 'change', {
        detail: { value: null },
      })
      if (this.$popup.open) {
        this.#updateDatePanel(null)
        this.#updateTimePanel(null)
      }
      this.render()
    } else {
      const [from, to] = value as [Date, Date]
      this.#valueFrom = from
      this.#valueTo = to
      if (this.$popup.open) {
        const date = this.#isFromActive() ? from : to
        this.#updateDatePanel(date)
        this.#updateTimePanel(date)
      }
      dispatchEvent(this, 'change', {
        detail: { value },
      })
      this.render()
    }
  }

  #isFromActive() {
    return this.#activeInput === this.$fromDate
  }

  #isToActive() {
    return this.#activeInput === this.$toDate
  }

  // 设置 bl-input 激活状态
  #switchActiveInput($input: HTMLInputElement | null) {
    const { $fromDate, $toDate } = this
    const inputs = [$fromDate, $toDate]
    this.#activeInput = $input
    if ($input == null) {
      inputs.forEach($input => $input.classList.remove('active'))
      return
    }
    const isFrom = this.#isFromActive()
    $fromDate.classList.toggle('active', isFrom)
    $toDate.classList.toggle('active', !isFrom)

    this.$popup.origin = isFrom ? PopupOrigin.TopStart : PopupOrigin.TopEnd

    const value = this.activeValue
    this.#updateDatePanel(value)
    this.#updateTimePanel(value)
  }

  // 更新 date 面板
  #updateDatePanel(date: Date | null) {
    this.$date.selected = date === null ? [] : [date]
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
      if (this.#isFromActive()) {
        // 如果结束时间还没设置，则任何开始时间都允许
        if (!this.#valueTo) return false
        // 否则开始时间不能大于结束时间
        const to = makeDateFrom('day', this.#valueTo)
        const from = makeDate({
          year: data.year,
          monthIndex: data.month,
          day: data.date,
        })
        return from.getTime() > to.getTime()
      } else {
        // 如果开始时间还没设置，则任何结束事件都允许
        if (!this.#valueFrom) return false
        // 否则结束时间不能小于开始时间
        const from = makeDateFrom('day', this.#valueFrom)
        const to = makeDate({
          year: data.year,
          monthIndex: data.month,
          day: data.date,
        })
        return to.getTime() < from.getTime()
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

  #setupClickOutside() {
    if (!this.#clearClickOutside) {
      this.#clearClickOutside = onClickOutside([this, this.$popup], () => {
        if (this.$popup.open) {
          this.$popup.open = false
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

  #renderResult() {
    this.$fromDate.value = this.#valueFrom ? this.#formatter.content(this.#valueFrom) : ''
    this.$toDate.value = this.#valueTo ? this.#formatter.content(this.#valueTo) : ''
  }

  #renderPlaceholder() {
    this.$fromDate.placeholder = this.placeholderFrom ?? '选择日期时间'
    this.$toDate.placeholder = this.placeholderTo ?? '选择日期时间'
  }

  override render() {
    super.render()
    this.#renderResult()
    this.#renderPlaceholder()
  }

  #updateLayout() {
    this.$time.style.height = this.$date.$content.offsetHeight + 'px'
    this.$timeValue.style.height = this.$date.offsetHeight - this.$date.$content.offsetHeight - 1 + 'px'
  }

  static override get observedAttributes() {
    return BlocksInput.observedAttributes
      .concat(BlocksDate.observedAttributes)
      .concat(BlocksTime.observedAttributes)
      .concat(['range', 'placeholder-from', 'placeholder-to'])
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
