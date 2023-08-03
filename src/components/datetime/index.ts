import type { BlComponentEventListener } from '../component/Component.js'
import type { ISelectListEventMap, ISelectableListComponent, ISelected } from '../../common/connectSelectable.js'
import '../loading/index.js'
import { attr } from '../../decorators/attr/index.js'
import { compile } from '../../common/dateFormat.js'
import { computed, reactive, subscribe } from '../../common/reactive.js'
import { copyDate, today } from '../../common/date.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { enumGetter, enumSetter } from '../../common/property.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { fromAttr } from '../component/reactive.js'
import { style } from './style.js'
import { template } from './template.js'
import { BlControl } from '../base-control/index.js'
import { BlDate } from '../date/index.js'
import { BlTime } from '../time/index.js'
import { Depth, WeekNumber } from '../date/type.js'
import * as Helpers from '../date/helpers.js'

export interface BlDateTimeEventMap extends ISelectListEventMap<Date> {
  change: CustomEvent<{ value: Date | null }>
}

export interface BlDateTime extends BlControl, ISelectableListComponent {
  addEventListener<K extends keyof BlDateTimeEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDateTimeEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof BlDateTimeEventMap>(
    type: K,
    listener: BlComponentEventListener<BlDateTimeEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

export const dateTimeEquals = (a: Date | null, b: Date | null): boolean => {
  if (a === b) return true
  if (a == null || b == null) return false
  return a.getTime() === b.getTime()
}

@defineClass({
  customElement: 'bl-datetime',
  styles: [style],
  attachShadow: {
    mode: 'open',
    // 代理焦点，
    // 1. 点击 shadow DOM 内某个不可聚焦的区域，则第一个可聚焦区域将成为焦点
    // 2. 当 shadow DOM 内的节点获得焦点时，除了聚焦的元素外，:focus 还会应用到宿主
    // 3. 自己的 slot 中的元素聚焦，宿主不会获得焦点，但是 :focus-within 生效
    delegatesFocus: true,
  },
})
export class BlDateTime extends BlControl implements ISelectableListComponent {
  static override get observedAttributes() {
    return [...BlDate.observedAttributes, ...BlTime.observedAttributes]
  }

  @attr('string', { defaults: 'YYYY-MM-DD HH:mm:ss' }) accessor format!: string
  @attr('string', { defaults: 'HH:mm:ss' }) accessor timeFormat!: string

  @attr('string', {
    get(self) {
      const value = enumGetter('min-depth', Helpers.Depths)(self) ?? Depth.Century
      return Helpers.normalizeMinDepth(value, Depth.Month)
    },
    set(self, value: Depth) {
      if (Helpers.Depths.includes(value)) {
        enumSetter('min-depth', Helpers.Depths)(self, Helpers.normalizeMinDepth(value, Depth.Month))
      }
    },
  })
  accessor minDepth!: Depth

  @attr('string', {
    get(self) {
      const value = enumGetter('start-depth', Helpers.Depths)(self) ?? Depth.Month
      return Helpers.normalizeActiveDepth(value, self.minDepth, Depth.Month)
    },
    set(self, value: Depth) {
      if (Helpers.Depths.includes(value)) {
        enumSetter('start-depth', Helpers.Depths)(self, Helpers.normalizeActiveDepth(value, self.minDepth, Depth.Month))
      }
    },
  })
  accessor startDepth!: Depth

  @attr('string', {
    get(self) {
      const value = enumGetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(self) ?? '1'
      return Number(value) as WeekNumber
    },
    set(self, value: Depth) {
      enumSetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(self, String(value))
    },
  })
  accessor startWeekOn!: WeekNumber

  @shadowRef('[part="date"]') accessor $date!: BlDate
  @shadowRef('[part="time"]') accessor $time!: BlTime
  @shadowRef('[part="time-value"]') accessor $timeValue!: HTMLElement

  formatter = computed(format => compile(format), [fromAttr(this, 'format')])
  timeFormatter = computed(format => compile(format), [fromAttr(this, 'timeFormat')])

  #model = reactive<Date | null>(null, dateTimeEquals)

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTabIndex(null)

    this.#setupDate()
    this.#setupTime()
    this.#setupValue()
  }

  get selected() {
    return this.#model.content
  }

  set selected(date: Date | null) {
    this.#model.content = date
  }

  get disabledDate() {
    return this.$date.disabledDate
  }
  set disabledDate(value) {
    this.$date.disabledDate = value
  }

  get disabledTime() {
    return this.$time.disabledTime
  }
  set disabledTime(value) {
    this.$time.disabledTime = value
  }

  defaultDate(): Date {
    return today()
  }

  /** 清空当前的选择值 */
  // ISelectableListComponent
  clearSelected() {
    this.#model.content = null
    dispatchEvent(this, 'select-list:after-clear')
  }

  // ISelectableListComponent
  deselect(selected: ISelected) {
    const date = selected.value
    if (dateTimeEquals(date, this.#model.content)) {
      this.#model.content = null
    }
  }

  // 检测两个日期是否相同
  dateTimeEquals(a: Date, b: Date): boolean {
    return dateTimeEquals(a, b)
  }

  showValue(date: Date) {
    return this.$date.showValue(date)
  }

  scrollToActive() {
    this.$time.scrollToActive()
  }

  #setupDate() {
    this.$date.dateEquals = dateTimeEquals
    this.$date.activeDepth = this.startDepth

    this.hook.onAttributeChangedDeps(BlDate.observedAttributes, (name, oldValue, newValue) => {
      if (name === 'depth') return
      if (name === 'mode') return
      this.$date.setAttribute(name, newValue as string)
    })

    this.hook.onRender(() => {
      this.$date.render()
    })
  }

  #setupTime() {
    this.hook.onAttributeChangedDeps(BlTime.observedAttributes, (name, oldValue, newValue) => {
      this.$time.setAttribute(name, newValue as string)
    })
    this.hook.onRender(() => {
      this.$time.render()
    })
  }

  #setupValue() {
    subscribe(this.#model, model => {
      if (model) {
        this.$timeValue.textContent = this.timeFormatter.content(model)
      } else {
        this.$timeValue.textContent = ''
      }
      // 先设置 time，后设置 date，以免在 datetime-range 中当 first model > second model 自动纠正时无限触发
      this.$time.value = model
        ? { hour: model.getUTCHours(), minute: model.getUTCMinutes(), second: model.getUTCSeconds() }
        : null
      this.$date.selected = model ? [model] : []
      if (model) {
        this.$date.showValue(model)
      }

      const selected = model ? [{ value: model, label: this.formatter.content(model) }] : []

      dispatchEvent(this, 'select-list:change', { detail: { value: selected } })
      dispatchEvent(this, 'change', { detail: { value: model } })
    })

    // 阻止冒泡，由 datetime 统一派发 select-list:change / change 事件
    this.$date.addEventListener('select-list:change', e => {
      e.stopImmediatePropagation()
    })

    this.$time.addEventListener('select-list:change', e => {
      e.stopImmediatePropagation()
    })

    this.$date.addEventListener('change', e => {
      e.stopImmediatePropagation()
      const date = e.detail.selected[0] ? copyDate(e.detail.selected[0]) : null
      if (date == null) {
        this.#model.content = null
        return
      }

      if (this.$time.value == null) {
        const model = this.$time.firstEnableModel()
        if (model == null) {
          this.#model.content = null
          return
        }
        date.setUTCHours(model.hour)
        date.setUTCMinutes(model.minute)
        date.setUTCSeconds(model.second)
      } else {
        date.setUTCHours(this.$time.hour!)
        date.setUTCMinutes(this.$time.minute!)
        date.setUTCSeconds(this.$time.second!)
      }
      this.#model.content = date
    })

    this.$time.addEventListener('change', e => {
      e.stopImmediatePropagation()
      const timeModel = e.detail.value
      if (timeModel == null) {
        this.#model.content = null
        return
      }
      const date = copyDate(this.#model.content ?? this.defaultDate())
      date.setUTCHours(timeModel.hour)
      date.setUTCMinutes(timeModel.minute)
      date.setUTCSeconds(timeModel.second)
      this.#model.content = date
    })
  }
}
