import { BlocksInput } from '../input/index.js'
import { BlocksPopup, PopupOrigin } from '../popup/index.js'
import { BlocksDate } from '../date/index.js'
import { BlocksTime } from '../time/index.js'
import { onClickOutside } from '../../common/onClickOutside.js'
import { dispatchEvent } from '../../common/event.js'
import { padLeft } from '../../common/utils.js'
import {
  boolGetter,
  boolSetter,
  strGetter,
  strSetter,
} from '../../common/property.js'
import { contentTemplate, popupTemplate, styleTemplate } from './template.js'
import { BlocksButton } from '../button/index.js'
import { makeDate, makeDateFrom } from '../../common/date.js'
import { ClearableControlBox } from '../base-clearable-control-box/index.js'
import { customElement } from '../../decorators/customElement.js'
import { attr } from '../../decorators/attr.js'

export interface BlocksDateTimePicker extends ClearableControlBox {
  _ref: ClearableControlBox['_ref'] & {
    $content: HTMLElement
    $fromDate: BlocksInput
    $toDate: BlocksInput
    $popup: BlocksPopup
    $date: BlocksDate
    $time: BlocksTime
    $timeValue: HTMLElement
    $confirm: BlocksButton
  }
}

@customElement('bl-datetime-picker')
export class BlocksDateTimePicker extends ClearableControlBox {
  // model
  #valueFrom: Date | null = null
  #valueTo: Date | null = null
  // 弹出日期、时间面板时，记录操作前的值，以便放弃操作时恢复
  #prevValueFrom: Date | null = null
  #prevValueTo: Date | null = null
  // （range 模式）当前操作的是开始还是结束
  #activeInput: BlocksInput | null = null

  #clearClickOutside?: () => void

  @attr('boolean') accessor range!: boolean

  @attr('string') accessor placeholderFrom = '选择日期时间'

  @attr('string') accessor placeholderTo = '选择日期时间'

  constructor() {
    super()

    this._appendStyle(styleTemplate())
    this._appendContent(contentTemplate())
    const $content = this.querySelectorShadow('#content') as HTMLElement
    const $fromDate = this.querySelectorShadow('#from-date') as BlocksInput
    const $toDate = this.querySelectorShadow('#to-date') as BlocksInput
    const $popup = popupTemplate()
    const $date = $popup.querySelector('bl-date')!
    const $time = $popup.querySelector('bl-time')!
    const $timeValue = $popup.querySelector('#time-value') as HTMLElement
    this._ref.$content = $content
    this._ref.$fromDate = $fromDate
    this._ref.$toDate = $toDate
    this._ref.$popup = $popup
    this._ref.$date = $date
    this._ref.$time = $time
    this._ref.$timeValue = $timeValue
    this._ref.$confirm = $popup.querySelector('bl-button')!

    $popup.anchor = () => this

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
      $date.value = null
    }

    const commit = () => {
      if (this.range) {
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
            value:
              this.#valueFrom && this.#valueTo
                ? [this.#valueFrom, this.#valueTo]
                : null,
          },
        })
        this._ref.$popup.open = false
      } else {
        dispatchEvent(this, 'change', {
          detail: { value: this.#valueTo },
        })
        this._ref.$popup.open = false
      }
    }

    $date.addEventListener('change', e => {
      const date = e.detail.value as Date | null
      if (date) {
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
          newValue = this.range
            ? copyDate(this.#valueFrom ?? this.#valueTo ?? today())
            : today()
        }
        newValue.setHours(hour)
        newValue.setMinutes(minute)
        newValue.setSeconds(second)
        stage(newValue)
        this.#renderResult()
        if (!$date.value) {
          this.#updateDatePanel(newValue)
        }
      } else {
        stage(null)
        this.#renderResult()
        if ($date.value) {
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
      if (this.range) {
        this.#prevValueFrom = this.#valueFrom ?? null
        this.#prevValueTo = this.#valueTo ?? null
      }
      const value = this.activeValue
      this.#updateDatePanel(value)
      this.#updateTimePanel(value)
      this.#updateLayout()
      this.#initClickOutside()
      dispatchEvent(this, 'opened')
    })

    // 面板非点击确定而关闭时，舍弃值
    $popup.addEventListener('closed', () => {
      if (this.range && (!this.#valueFrom || !this.#valueTo)) {
        // 区间模式，值不完整，则撤销
        discard()
      }
      this.#switchActiveInput(null)
      this.#destroyClickOutside()
      dispatchEvent(this, 'closed')
    })

    this._ref.$confirm.onclick = () => {
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
    if (!this.range) {
      return this.#valueTo
    }
    if (this.#isFromActive()) {
      return this.#valueFrom
    } else {
      return this.#valueTo
    }
  }

  set activeValue(value: Date | null) {
    if (!this.range) {
      this.#valueTo = value
      return
    }
    const isFromActive = this.#isFromActive()
    if (isFromActive) {
      this.#valueFrom = value
    } else {
      this.#valueTo = value
    }
    // 按钮 disabled 校验只做 date 面板
    // time 面板不限制，但是一旦出现开始时间大于结束时间（date 面板为同一天时有可能）这种非法值，
    // 则需要自动纠正：自动调整另一侧的 time 部分
    if (
      this.#valueFrom &&
      this.#valueTo &&
      this.#valueFrom?.getTime() > this.#valueTo.getTime()
    ) {
      if (isFromActive) {
        this.#valueTo.setTime(this.#valueFrom.getTime())
      } else {
        this.#valueFrom.setTime(this.#valueTo.getTime())
      }
    }
  }

  get value(): null | Date | [Date, Date] {
    if (!this.range) {
      return this.#valueTo
    }
    if (this.#valueFrom && this.#valueTo) {
      return [this.#valueFrom, this.#valueTo]
    } else {
      return null
    }
  }

  set value(value: null | Date | [Date, Date]) {
    if (!this.range) {
      this.#valueTo = value as null | Date
      if (this._ref.$popup.open) {
        this.#switchActiveInput(null)
        this.#updateDatePanel(value as null | Date)
        this.#updateTimePanel(value as null | Date)
      }
      dispatchEvent(this, 'change', {
        detail: { value },
      })
      this.render()
    } else {
      if (value == null) {
        this.#valueFrom = this.#valueTo = null
        this.#switchActiveInput(null)
        dispatchEvent(this, 'change', {
          detail: { value: null },
        })
        if (this._ref.$popup.open) {
          this.#updateDatePanel(null)
          this.#updateTimePanel(null)
        }
        this.render()
      } else {
        const [from, to] = value as [Date, Date]
        this.#valueFrom = from
        this.#valueTo = to
        if (this._ref.$popup.open) {
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
  }

  #isFromActive() {
    return this.range && this.#activeInput === this._ref.$fromDate
  }

  #isToActive() {
    return this.range && this.#activeInput === this._ref.$toDate
  }

  // 设置 bl-input 激活状态
  #switchActiveInput($input: BlocksInput | null) {
    if (!this.range) return

    const { $fromDate, $toDate } = this._ref
    const inputs = [$fromDate, $toDate]
    this.#activeInput = $input
    if ($input == null || !this.range) {
      inputs.forEach($input => $input.classList.remove('active'))
      return
    }
    const isFrom = this.#isFromActive()
    $fromDate.classList.toggle('active', isFrom)
    $toDate.classList.toggle('active', !isFrom)

    this._ref.$popup.origin = isFrom ? PopupOrigin.TopStart : PopupOrigin.TopEnd

    const value = this.activeValue
    this.#updateDatePanel(value)
    this.#updateTimePanel(value)
  }

  // 更新 date 面板
  #updateDatePanel(date: Date | null) {
    this._ref.$date.value = date
  }

  // 更新 time 面板
  #updateTimePanel(date: Date | null) {
    const { $time } = this._ref
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
    this._ref.$date.disabledDate = (data, ctx) => {
      if (this.disabledDate && this.disabledDate(data, ctx)) {
        return true
      }
      if (this.range) {
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
      }
      return false
    }

    this._ref.$time.disabledHour = (data, ctx) => {
      if (this.disabledHour && this.disabledHour(data, ctx)) {
        return true
      }
      return false
    }
    this._ref.$time.disabledMinute = (data, ctx) => {
      if (this.disabledMinute && this.disabledMinute(data, ctx)) {
        return true
      }
      return false
    }
    this._ref.$time.disabledSecond = (data, ctx) => {
      if (this.disabledSecond && this.disabledSecond(data, ctx)) {
        return true
      }
      return false
    }
  }

  override connectedCallback() {
    super.connectedCallback()

    if (!this.suffixIcon) {
      this.suffixIcon = 'time'
    }
    document.body.appendChild(this._ref.$popup)
    this.#setDisabledMethods()
    this.render()
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

    if (
      BlocksDate.observedAttributes.includes(attrName) &&
      attrName !== 'mode'
    ) {
      this._ref.$date.setAttribute(attrName, newValue)
    }

    if (attrName === 'range' && !this.range) {
      this.#valueFrom = this.#prevValueFrom = null
    }

    this.render()
  }

  #initClickOutside() {
    if (!this.#clearClickOutside) {
      this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
        if (this._ref.$popup.open) {
          this._ref.$popup.open = false
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
    if (this.#valueFrom) {
      const date = this.#valueFrom
      const year = date.getFullYear()
      const month = padLeft('0', 2, String(date.getMonth() + 1))
      const day = padLeft('0', 2, String(date.getDate()))
      const dateValue = `${year}-${month}-${day}`
      const h = padLeft('0', 2, String(date.getHours()))
      const m = padLeft('0', 2, String(date.getMinutes()))
      const s = padLeft('0', 2, String(date.getSeconds()))
      const timeValue = `${h}:${m}:${s}`
      this._ref.$fromDate.value = dateValue + ' ' + timeValue
    } else {
      this._ref.$fromDate.value = ''
    }

    if (this.#valueTo) {
      const date = this.#valueTo
      const year = date.getFullYear()
      const month = padLeft('0', 2, String(date.getMonth() + 1))
      const day = padLeft('0', 2, String(date.getDate()))
      const dateValue = `${year}-${month}-${day}`
      const h = padLeft('0', 2, String(date.getHours()))
      const m = padLeft('0', 2, String(date.getMinutes()))
      const s = padLeft('0', 2, String(date.getSeconds()))
      const timeValue = `${h}:${m}:${s}`
      this._ref.$toDate.value = dateValue + ' ' + timeValue
    } else {
      this._ref.$toDate.value = ''
    }
  }

  #renderPlaceholder() {
    this._ref.$fromDate.placeholder = this.placeholderFrom ?? '选择日期时间'
    this._ref.$toDate.placeholder = this.placeholderTo ?? '选择日期时间'
  }

  override render() {
    this.#renderResult()
    this.#renderPlaceholder()
  }

  #updateLayout() {
    this._ref.$time.style.height =
      this._ref.$date._ref.$content.offsetHeight + 'px'
    this._ref.$timeValue.style.height =
      this._ref.$date.offsetHeight -
      this._ref.$date._ref.$content.offsetHeight -
      1 +
      'px'
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
