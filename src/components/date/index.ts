import '../loading/index.js'
import {
  DateModel,
  Depth,
  Depths,
  normalizeMinDepth,
  normalizeViewDepth,
  getClosestDate,
  generateMonths,
  generateDates,
  generateYears,
  generateDecades,
  makeDate,
  normalizeNumber,
  yearToDecade,
  yearToCentury,
  decadeToCentury,
  isYearInDecade,
  firstYearOfDecade,
  isYearInCentury,
  firstYearOfCentury,
  lastYearOfCentury,
  lastYearOfDecade,
  generateWeekHeaders,
  isToday,
  isAllEqual,
} from './helpers.js'
import { boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { dispatchEvent } from '../../common/event.js'
import {
  Component,
  ComponentEventListener,
  ComponentEventMap,
} from '../Component.js'
import { template } from './template.js'
import { style } from './style.js'
import { customElement } from '../../decorators/customElement.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'
import type { EnumAttr } from '../../decorators/attr.js'

interface DateEventMap extends ComponentEventMap {
  select: CustomEvent<{ value: Date[] | [Date, Date] | null }>
  change: CustomEvent<{ value: Date[] | [Date, Date] | null }>
  'panel-change': CustomEvent<{ viewDepth: Depth }>
  'prev-month': CustomEvent<{
    century: number
    decade: number
    year: number
    month: number
  }>
  'next-month': CustomEvent<{
    century: number
    decade: number
    year: number
    month: number
  }>
  'prev-year': CustomEvent<{ century: number; decade: number; year: number }>
  'next-year': CustomEvent<{ century: number; decade: number; year: number }>
  'prev-decade': CustomEvent<{ century: number; decade: number }>
  'next-decade': CustomEvent<{ century: number; decade: number }>
  'prev-century': CustomEvent<{ century: number }>
  'next-century': CustomEvent<{ century: number }>
}

type Badge = { year: number; month?: number; date?: number; label?: string }

type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0

export interface BlocksDate extends Component {
  _ref: {
    $panel: HTMLElement
    $title: HTMLButtonElement
    $prevPrev: HTMLButtonElement
    $prev: HTMLButtonElement
    $nextNext: HTMLButtonElement
    $next: HTMLButtonElement
    $weekHeader: HTMLElement
    $content: HTMLElement
    $list: HTMLElement
    $loading: HTMLElement
  }

  addEventListener<K extends keyof DateEventMap>(
    type: K,
    listener: ComponentEventListener<DateEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof DateEventMap>(
    type: K,
    listener: ComponentEventListener<DateEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@customElement('bl-date')
@attachShadow({
  mode: 'open',
  // 代理焦点，
  // 1. 点击 shadow DOM 内某个不可聚焦的区域，则第一个可聚焦区域将成为焦点
  // 2. 当 shadow DOM 内的节点获得焦点时，除了聚焦的元素外，:focus 还会应用到宿主
  // 3. 自己的 slot 中的元素聚焦，宿主不会获得焦点，但是 :focus-within 生效
  delegatesFocus: true,
})
@applyStyle(style)
export class BlocksDate extends Component {
  // 按钮元素池
  #$pool: HTMLButtonElement[]

  // 选中值
  #value: Date[]

  constructor() {
    super()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template())

    const $panel = shadowRoot.querySelector('#layout') as HTMLElement
    const $title = $panel.querySelector('.header-title') as HTMLButtonElement
    const $prevPrev = $panel.querySelector(
      '.button-prevPrev'
    ) as HTMLButtonElement
    const $prev = $panel.querySelector('.button-prev') as HTMLButtonElement
    const $nextNext = $panel.querySelector(
      '.button-nextNext'
    ) as HTMLButtonElement
    const $next = $panel.querySelector('.button-next') as HTMLButtonElement
    const $weekHeader = $panel.querySelector('.week-header') as HTMLElement
    const $content = $panel.querySelector('#body') as HTMLElement
    const $list = $panel.querySelector('.button-list') as HTMLElement
    const $loading = $panel.querySelector('.body-loading') as HTMLElement

    this._ref = {
      $panel,
      $title,
      $prevPrev,
      $prev,
      $nextNext,
      $next,
      $weekHeader,
      $content,
      $list,
      $loading,
    }

    this.#$pool = []
    this.#value = []

    // 面板视图深度层级
    this.viewDepth = this.startdepth

    // 设置面板起始视图状态
    this.switchViewByDate(getClosestDate(this.#value) ?? new Date())

    $panel.onclick = e => {
      const target = e.target as HTMLElement
      if ($prevPrev.contains(target)) {
        this.#onPrevPrev()
      } else if ($prev.contains(target)) {
        this.#onPrev()
      } else if ($next.contains(target)) {
        this.#onNext()
      } else if ($nextNext.contains(target)) {
        this.#onNextNext()
      } else if ($title.contains(target)) {
        this.rollUp()
      } else if (target.classList.contains('button-item')) {
        this.#onClickItem(this.#getModel(target))
      } else if (
        (target.parentElement as HTMLElement)?.classList.contains('button-item')
      ) {
        this.#onClickItem(this.#getModel(target.parentElement!))
      }
      this.focus()
    }

    // range 选择模式，鼠标移入，渲染选中效果
    $panel.onmouseover = e => {
      if (!this.#isLeafDepth()) return
      if (!this.isRangeMode()) return
      if (!this.rangeFrom) return
      if (this.rangeTo) return
      const target = e.target as HTMLElement
      const $button = target.classList.contains('button-item')
        ? target
        : (target.parentElement as HTMLElement).classList.contains(
            'button-item'
          )
        ? (target.parentElement as HTMLElement)
        : null
      if (!$button) return
      this.maybeRangeTo = this.#getModel($button)
      this.render()
    }
  }

  /** range 模式，设置 range 起点 */
  #rangeFrom?: DateModel | null
  get rangeFrom() {
    return this.#rangeFrom
  }
  set rangeFrom(value) {
    this.#rangeFrom = value
  }

  /** range 模式，设置 range 终点 */
  #rangeTo?: DateModel | null
  /** range 模式，设置了 rangeFrom 但还没设置 rangeTo 时，鼠标移动到其他的日期上，需要渲染预览效果 */
  maybeRangeTo?: DateModel | null
  get rangeTo() {
    return this.#rangeTo
  }
  set rangeTo(value) {
    if (value !== null) {
      this.maybeRangeTo = null
    }
    this.#rangeTo = value
  }

  #disabledDate?: (
    data: DateModel,
    context: {
      depth: Depth
      viewDepth: Depth
      component: BlocksDate
    }
  ) => boolean

  get disabledDate() {
    return this.#disabledDate
  }

  set disabledDate(value) {
    this.#disabledDate = value
  }

  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor loading!: boolean

  @attr('int') accessor max!: number | null

  @attr('enum', { enumValues: ['single', 'multiple', 'range'] })
  accessor mode: EnumAttr<['single', 'multiple', 'range']> = 'single'

  /**
   * 用于确定哪一层级深度的面板是最终层级，用于 emit 值，具体：
   * 值为 Depth.Month 时，该组件用于选择日
   * 值为 Depth.Year 时，该组件用于选择月份
   * 值为 Depth.Decade 时，该组件用于选择年份
   */
  @attr('enum', { enumValues: [Depth.Month, Depth.Year, Depth.Decade] })
  accessor depth: EnumAttr<[Depth.Month, Depth.Year, Depth.Decade]> =
    Depth.Month

  /**
   * 往上最小层级深度，如：
   * 当前处于月面板，最小层级为年，则点击标题栏最多可以往上切换到年份面板，而无法继续往上切换到十年、世纪面板视图
   */
  get mindepth(): Depth {
    const value = enumGetter('mindepth', Depths)(this) ?? Depth.Century
    return normalizeMinDepth(value, this.depth)
  }

  set mindepth(value) {
    if (Depths.includes(value)) {
      enumSetter('mindepth', Depths)(this, normalizeMinDepth(value, this.depth))
    }
  }

  /**
   * 组件初始化的时候，展示哪个层级深度的面板
   */
  get startdepth() {
    const value = enumGetter('startdepth', Depths)(this) ?? this.depth
    return normalizeViewDepth(value, this.mindepth, this.depth)
  }

  set startdepth(value) {
    if (Depths.includes(value)) {
      enumSetter('startdepth', Depths)(
        this,
        normalizeViewDepth(value, this.mindepth, this.depth)
      )
    }
  }

  #badges?: Badge[]
  get badges(): Badge[] {
    return this.#badges ?? []
  }

  set badges(value: Badge[]) {
    this.#badges = value
    this.render()
  }

  get startWeekOn(): WeekNumber {
    const value =
      enumGetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(this) ??
      '1'
    return Number(value) as WeekNumber
  }

  set startWeekOn(value: WeekNumber) {
    enumSetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(
      this,
      String(value)
    )
  }

  get multiple() {
    return this.mode === 'multiple'
  }

  /**
   * 当前渲染的面板深度
   */
  #viewDepth?: any
  get viewDepth() {
    return normalizeViewDepth(this.#viewDepth, this.mindepth, this.depth)
  }

  set viewDepth(value) {
    if (this.#viewDepth === value) return
    this.#viewDepth = normalizeViewDepth(value, this.mindepth, this.depth)
    this.render()
  }

  // 世纪视图时，展示哪个世纪的选项
  // 没有设置时，默认取年份的，年份也没有设置时，取当前年的
  #viewCentury?: number
  get viewCentury() {
    if (this.#viewCentury != null) return this.#viewCentury
    return yearToCentury(this.viewYear ?? new Date().getFullYear())
  }

  set viewCentury(value) {
    const century = normalizeNumber(value)
    if (century == null) return
    if (this.#viewCentury !== century) {
      this.#viewCentury = century
      if (!isYearInCentury(this.viewYear, century)) {
        this.#viewYear = firstYearOfDecade(century)
      }
      this.render()
    }
  }

  // 十年视图时，展示哪个十年的选项
  // 没有设置时，默认取年份的，年份也没有设置时，取当前年的
  #viewDecade?: number
  get viewDecade() {
    if (this.#viewDecade != null) return this.#viewDecade
    return yearToDecade(this.viewYear ?? new Date().getFullYear())
  }

  set viewDecade(value) {
    const decade = normalizeNumber(value)
    if (decade == null) return
    if (this.#viewDecade !== decade) {
      this.#viewDecade = decade
      this.#viewCentury = decadeToCentury(decade)
      if (!isYearInDecade(this.viewYear, decade)) {
        this.#viewYear = firstYearOfDecade(decade)
      }
      this.render()
    }
  }

  // 年度视图，显示哪个年度的数据
  #viewYear?: number
  get viewYear() {
    return this.#viewYear ?? new Date().getFullYear()
  }

  set viewYear(value) {
    const year = normalizeNumber(value)
    if (year == null) return
    if (this.#viewYear !== year) {
      this.#viewYear = year
      this.#viewDecade = yearToDecade(year)
      this.#viewCentury = yearToCentury(year)
      this.render()
    }
  }

  // 月度视图，显示哪个月的数据
  #viewMonth?: number
  get viewMonth() {
    return this.#viewMonth
  }

  set viewMonth(value) {
    if (this.#viewMonth !== value) {
      this.#viewMonth = value
      this.render()
    }
  }

  // 组件值
  get value(): Date | Date[] | null {
    switch (this.mode) {
      case 'single':
        return this.#value.length ? this.#value[0] : null
      case 'range':
        return this.#value.length === 2 ? this.#value.slice() : null
      case 'multiple':
        return this.#value.length ? this.#value.slice() : null
    }
  }

  set value(value) {
    switch (this.mode) {
      case 'single':
        if (value === null || value instanceof Date) {
          this.setValue(value)
        } else if (value[0] instanceof Date) {
          this.setValue(value[0])
        }
        break
      case 'range':
        if ((Array.isArray(value) && value.length === 2) || value === null) {
          this.setRange(value as [Date, Date] | null)
        }
        break
      case 'multiple':
        if (value instanceof Date) {
          this.setValues([value])
        } else {
          this.setValues(value!)
        }
        break
    }
  }

  /** 取消未完成的 range 选择状态 */
  clearUncompleteRange() {
    if (this.mode !== 'range') return
    if (this.value !== null) {
      const [from, to] = this.value as [Date, Date]
      this.rangeFrom = this.#dateToModel(from, this.viewDepth)
      this.rangeTo = this.#dateToModel(to, this.viewDepth)
    } else {
      this.rangeFrom = this.rangeTo = null
    }
    this.render()
  }

  /** 清空当前的选择值 */
  clearValue() {
    this.#value = []
    if (this.mode === 'range') {
      this.rangeFrom = this.rangeTo = null
    }
    this.render()
  }

  // single mode 的值 getter
  getValue(): Date | null {
    return this.mode === 'single' ? this.#value[0] ?? null : null
  }

  // single mode 的值 setter
  setValue(value: Date | null) {
    if (this.mode !== 'single') return
    if (value === null) {
      if (this.value !== null) {
        this.clearValue()
      }
      return
    }
    const currentValue = this.#value[0]
    const hasChange =
      currentValue !== value ||
      !currentValue ||
      currentValue.getTime() !== value.getTime()
    if (hasChange) {
      this.#value = [value]
      this.render()
      dispatchEvent(this, 'select', { detail: { value: this.value } })
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    }
  }

  // range mode 的值 getter
  getRange(): [Date, Date] | null {
    return this.mode === 'range' && this.#value.length === 2
      ? (this.#value.slice() as [Date, Date])
      : null
  }

  // range mode 的值 setter
  setRange(value: [Date, Date] | null) {
    if (this.mode !== 'range') return
    if (value === null) {
      if (this.value !== null) {
        this.clearValue()
      }
      return
    }
    if (!Array.isArray(value)) {
      return
    }
    if (
      !Array.isArray(value) ||
      value.length !== 2 ||
      !value.every(date => date instanceof Date)
    ) {
      return
    }
    const range = value
      .slice()
      .sort((a: Date, b: Date) => a.getTime() - b.getTime())

    const hasChange = !isAllEqual(this.#value, range)
    if (hasChange) {
      this.#value = range
      this.maybeRangeTo = null
      if (range.length) {
        this.rangeFrom = this.#dateToModel(range[0], this.viewDepth)
        this.rangeTo = this.#dateToModel(range[1], this.viewDepth)
      } else {
        this.rangeFrom = this.rangeTo = null
      }
      this.render()
      dispatchEvent(this, 'select', { detail: { value: this.value } })
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    }
  }

  // multiple mode 的值 getter
  getValues(): Date[] {
    return this.mode === 'multiple' && this.#value.length
      ? this.#value.slice()
      : []
  }

  // multiple mode 的值 setter
  setValues(values: Date[]) {
    if (this.mode !== 'multiple') return
    if (values.length === 0) {
      if (this.value !== null) {
        this.clearValue()
      }
      return
    }
    if (!Array.isArray(values)) {
      return
    }
    if (
      !Array.isArray(values) ||
      values.length > (this.max ?? Infinity) ||
      !values.every(date => date instanceof Date)
    ) {
      return
    }

    const hasChange = !isAllEqual(this.#value, values)
    if (hasChange) {
      this.#value = values
      this.render()
      dispatchEvent(this, 'select', { detail: { value: this.value } })
      dispatchEvent(this, 'change', { detail: { value: this.value } })
    }
  }

  isRangeMode() {
    return this.mode === 'range'
  }

  getDecadeRange(decade: number): [number, number] {
    const from = decade * 10
    const to = from + 9
    return [from, to]
  }

  // 是否已经选够最大数量的值
  limitReached() {
    if (!this.multiple || !this.max) return false
    let max = Math.trunc(this.max)
    if (max < 1) max = 1
    const len = this.getValues()?.length ?? 0
    return len >= max
  }

  switchViewByDate(date: Date) {
    this.viewMonth = date.getMonth()
    this.viewYear = date.getFullYear()
  }

  #getModel($item: HTMLElement): DateModel {
    return {
      label: $item.dataset.label!,
      century: +$item.dataset.century! || 0,
      decade: +$item.dataset.decade!,
      year: +$item.dataset.year!,
      month: +$item.dataset.month!,
      date: +$item.dataset.date!,
    }
  }

  // 渲染面板顶部按钮（前前翻页、前翻页、后翻页、后后翻页）
  #renderHeaderButtons() {
    if (this.viewDepth === Depth.Month) {
      this._ref.$prevPrev.style.cssText = ''
      this._ref.$nextNext.style.cssText = ''
    } else {
      this._ref.$prevPrev.style.cssText = 'transfrom:scale(0,0);flex:0 0 0'
      this._ref.$nextNext.style.cssText = 'transfrom:scale(0,0);flex:0 0 0'
    }
  }

  // 渲染面板顶部标题（指示当前面板的可选范围）
  #renderTitle() {
    let text: string
    switch (this.viewDepth) {
      case Depth.Century: {
        text = `${firstYearOfCentury(this.viewCentury)} ~ ${lastYearOfCentury(
          this.viewCentury
        )}`
        break
      }
      case Depth.Decade: {
        text = `${firstYearOfDecade(this.viewDecade)} ~ ${lastYearOfDecade(
          this.viewDecade
        )}`
        break
      }
      case Depth.Year: {
        text = `${this.viewYear}`
        break
      }
      default:
        text = `${this.viewYear} / ${this.viewMonth! + 1}`
    }
    this._ref.$title.textContent = text
  }

  // 渲染日历的星期几标题行（仅在月视图渲染）
  #renderWeekHeader() {
    const headers = generateWeekHeaders(this.startWeekOn)
    const $weekHeader = this._ref.$weekHeader
    if (this.viewDepth === Depth.Month) {
      $weekHeader.style.height = ''
      $weekHeader.style.opacity = '1'

      if ($weekHeader.children.length !== 7) {
        $weekHeader.innerHTML = headers
          .map(header => `<span>${header}</span>`)
          .join('')
      } else {
        for (let i = 0; i < 7; i += 1) {
          $weekHeader.children[i].textContent = headers[i]
        }
      }
    } else {
      $weekHeader.style.height = '0'
      $weekHeader.style.opacity = '0'
    }
  }

  // 渲染 loading 状态
  #renderLoading() {
    this._ref.$loading.style.display = this.loading ? '' : 'none'
  }

  // 渲染日期选择按钮
  #renderItems() {
    ;['body-century', 'body-decade', 'body-year', 'body-month'].forEach(
      klass => {
        this._ref.$content.classList.remove(klass)
      }
    )
    this._ref.$content.classList.add(`body-${this.viewDepth}`)

    if (this.viewDepth === Depth.Month) {
      this.#renderDateItems()
    } else if (this.viewDepth === Depth.Year) {
      this.#renderMonthItems()
    } else if (this.viewDepth === Depth.Decade) {
      this.#renderYearItems()
    } else if (this.viewDepth === Depth.Century) {
      this.#renderDecadeItems()
    }
  }

  // 只保留 N 个日期选择按钮
  #ensureItemCount(n: number) {
    const $list = this._ref.$list
    let len = $list.children.length ?? 0
    while (len++ < n) {
      if (this.#$pool.length) {
        $list.appendChild(this.#$pool.pop()!)
      } else {
        const el = document.createElement('button')
        el.className = 'button-item'
        el.appendChild(document.createElement('span'))
        $list.appendChild(el)
      }
    }
    len = $list.children.length
    while (len-- > n) {
      this.#$pool.push(
        $list.removeChild($list.lastElementChild as HTMLButtonElement)
      )
    }
    return Array.prototype.slice.call($list.children)
  }

  // 渲染世纪年视图的十年选择按钮
  #renderDecadeItems() {
    const decades = generateDecades(this.viewCentury)
    if (!decades.length) return
    this.#ensureItemCount(10).forEach(($el, i) => {
      const model = decades[i]
      boolSetter('disabled')($el, false)
      $el.classList.toggle('button-item--otherMonth', false)
      $el.classList.toggle('button-item--today', false)
      $el.classList.toggle('button-item--active', false)
      $el.classList.toggle(
        'button-item--includesActive',
        this.#includesActive(model)
      )
      $el.classList.toggle('button-item--rangeFrom', false)
      $el.classList.toggle('button-item--rangeTo', false)
      $el.classList.toggle('button-item--rangeIn', false)

      $el.dataset.century = model.century
      $el.dataset.decade = model.decade
      $el.dataset.year = null
      $el.dataset.month = null
      $el.dataset.date = null
      $el.dataset.label = model.label

      $el.lastElementChild.innerHTML = model.label
      this.#renderBadge($el, model)
    })
  }

  // 渲染十年视图的年度选择按钮
  #renderYearItems() {
    const years = generateYears(this.viewCentury, this.viewDecade)
    if (!years.length) return
    this.#ensureItemCount(10).forEach(($el, i) => {
      const item = years[i]
      if (this.depth === Depth.Decade) {
        // TODO, any
        boolSetter('disabled')(
          $el,
          !this.#isActiveLeaf(item as any) && this.#isDisabledLeaf(item as any)
        )
      } else {
        boolSetter('disabled')($el, false)
      }
      $el.classList.toggle('button-item--otherMonth', false)
      $el.classList.toggle('button-item--today', false)
      $el.classList.toggle(
        'button-item--active',
        this.#isActiveLeaf(item as any)
      )
      $el.classList.toggle(
        'button-item--includesActive',
        this.#includesActive(item as any)
      )

      const isRangeMode = this.isRangeMode()
      $el.classList.toggle(
        'button-item--rangeFrom',
        isRangeMode && this.#isRangeFrom(item as any)
      )
      $el.classList.toggle(
        'button-item--rangeTo',
        isRangeMode && this.#isRangeTo(item as any)
      )
      $el.classList.toggle(
        'button-item--rangeIn',
        isRangeMode && this.#isInRange(item as any)
      )

      $el.dataset.century = item.century
      $el.dataset.decade = item.decade
      $el.dataset.year = item.year
      $el.dataset.month = null
      $el.dataset.date = null
      $el.dataset.label = item.label

      $el.lastElementChild.innerHTML = item.label
      this.#renderBadge($el, item)
    })
  }

  // 渲染年视图的月份选择按钮
  #renderMonthItems() {
    const months = generateMonths(
      this.viewCentury,
      this.viewDecade,
      this.viewYear!
    )
    if (!months.length) return
    this.#ensureItemCount(12).forEach(($el, i) => {
      const item = months[i]
      $el.classList.toggle('button-item--otherMonth', false)
      $el.classList.toggle('button-item--today', false)
      $el.classList.toggle(
        'button-item--active',
        this.#isActiveLeaf(item as any)
      )
      $el.classList.toggle(
        'button-item--includesActive',
        this.#includesActive(item as any)
      )
      const isRangeMode = this.isRangeMode()
      $el.classList.toggle(
        'button-item--rangeFrom',
        isRangeMode && this.#isRangeFrom(item as any)
      )
      $el.classList.toggle(
        'button-item--rangeTo',
        isRangeMode && this.#isRangeTo(item as any)
      )
      $el.classList.toggle(
        'button-item--rangeIn',
        isRangeMode && this.#isInRange(item as any)
      )
      if (this.depth === Depth.Year) {
        boolSetter('disabled')(
          $el,
          !this.#isActiveLeaf(item as any) && this.#isDisabledLeaf(item as any)
        )
      } else {
        boolSetter('disabled')($el, false)
      }
      $el.dataset.century = item.century
      $el.dataset.decade = item.decade
      $el.dataset.year = item.year
      $el.dataset.month = item.month
      $el.dataset.date = null
      $el.dataset.label = item.label
      $el.lastElementChild.innerHTML = item.label
      this.#renderBadge($el, item)
    })
  }

  // 渲染月视图的日期选择按钮
  #renderDateItems() {
    const dateList = generateDates(
      this.viewCentury,
      this.viewDecade,
      this.viewYear!,
      this.viewMonth!,
      this.startWeekOn
    )
    if (!dateList.length) return
    this.#ensureItemCount(42).forEach(($el, i) => {
      const item = dateList[i]
      boolSetter('disabled')(
        $el,
        !this.#isActiveLeaf(item as any) && this.#isDisabledLeaf(item as any)
      )
      // 月视图中，根据周起始日，可能包含上月末的几天，
      // 以及下月初的某几天，为这些非当前视图对应的日期按钮应用弱化样式
      $el.classList.toggle(
        'button-item--otherMonth',
        item.month !== this.viewMonth
      )
      $el.classList.toggle('button-item--today', isToday(item))
      $el.classList.toggle(
        'button-item--active',
        this.#isActiveLeaf(item as any)
      )
      $el.classList.toggle('button-item--includesActive', false)
      const isRangeMode = this.isRangeMode()
      $el.classList.toggle(
        'button-item--rangeFrom',
        isRangeMode && this.#isRangeFrom(item as any)
      )
      $el.classList.toggle(
        'button-item--rangeTo',
        isRangeMode && this.#isRangeTo(item as any)
      )
      $el.classList.toggle(
        'button-item--rangeIn',
        isRangeMode && this.#isInRange(item as any)
      )

      $el.dataset.century = item.century
      $el.dataset.decade = item.decade
      $el.dataset.year = item.year
      $el.dataset.month = item.month
      $el.dataset.date = item.date
      $el.dataset.label = item.label

      $el.lastElementChild.innerHTML = item.label
      this.#renderBadge($el, item)
    })
  }

  // 日期按钮上渲染事件标志
  #renderBadge($el: HTMLElement, item: DateModel) {
    const badges = this.getBadges(item)
    let $badge = $el.querySelector('.button-badge')
    if (badges.length === 0) {
      $el.title = ''
      if ($badge) $el.removeChild($badge)
      return
    }

    if (!$badge) {
      $badge = $el.appendChild(document.createElement('i'))
    }

    $badge.classList.add('button-badge')

    let title = badges
      .filter(badge => badge.label)
      .map(badge => badge.label)
      .join('\n')
    if (title.length > 100) title = title.slice(0, 97) + '...'
    $el.title = title
  }

  override render() {
    this.#renderHeaderButtons()
    this.#renderTitle()
    this.#renderWeekHeader()
    this.#renderLoading()
    this.#renderItems()
  }

  // 获取当前选项对应的 badge
  getBadges(item: DateModel) {
    let badges: Badge[]
    if (this.viewDepth === Depth.Month) {
      badges = this.badges.filter(
        b =>
          item.date === b.date && item.month === b.month && b.year === item.year
      )
    } else if (this.viewDepth === Depth.Year) {
      badges = this.badges.filter(
        b => item.month === b.month && b.year === item.year
      )
    } else if (this.viewDepth === Depth.Decade) {
      badges = this.badges.filter(b => b.year === item.year)
    } else if (this.viewDepth === Depth.Century) {
      badges = this.badges.filter(
        b => b.year >= item.decade * 10 && b.year <= item.decade * 10 + 9
      )
    } else {
      badges = []
    }
    return badges
  }

  #isRangeFrom(item: DateModel) {
    let obj = this.rangeFrom
    if (!obj) return false
    const obj2 = this.rangeTo ?? this.maybeRangeTo
    if (
      obj2 &&
      this.#modelToDate(obj).getTime() > this.#modelToDate(obj2).getTime()
    ) {
      obj = obj2
    }
    return ['year', 'month', 'date'].every(
      key => (obj as any)[key] === (item as any)[key]
    )
  }

  #isRangeTo(item: DateModel) {
    let obj = this.rangeFrom
    if (!obj) return false
    const obj2 = this.rangeTo ?? this.maybeRangeTo
    if (
      obj2 &&
      this.#modelToDate(obj).getTime() < this.#modelToDate(obj2).getTime()
    ) {
      obj = obj2
    }
    return ['year', 'month', 'date'].every(
      key => (obj as any)[key] === (item as any)[key]
    )
  }

  // 当前选项是否渲染成禁用，仅作用于末级 depth
  #isDisabledLeaf(item: DateModel) {
    // 对于多选，需要检查是否抵达数量上限
    if (this.limitReached()) return true

    // 如果外部传入了 disabledDate 检查
    // 校验（depth 末级）选项是否可用
    if (this.disabledDate) {
      return this.disabledDate(item, {
        depth: this.depth,
        viewDepth: this.viewDepth,
        component: this,
      })
    } else {
      if (this.viewDepth !== this.depth) return false
      return false
    }
  }

  #isSameDate(item: DateModel, date: Date) {
    return (
      date.getFullYear() === item.year &&
      date.getMonth() === item.month &&
      date.getDate() === item.date
    )
  }

  #isSameMonth(item: DateModel, date: Date) {
    return date.getFullYear() === item.year && date.getMonth() === item.month
  }

  #isSameYear(item: DateModel, date: Date) {
    return date.getFullYear() === item.year
  }

  #isInRange(item: DateModel) {
    if (!this.#isLeafDepth()) return false
    if (!this.rangeFrom) return false
    if (!this.rangeTo && !this.maybeRangeTo) return false
    let inRange: (t1: Date, t2: Date) => boolean
    if (this.depth === Depth.Month) {
      inRange = (t1: Date, t2: Date) => {
        const t1Time = makeDate(
          t1.getFullYear(),
          t1.getMonth(),
          t1.getDate()
        ).getTime()
        const t2Time = makeDate(
          t2.getFullYear(),
          t2.getMonth(),
          t2.getDate()
        ).getTime()
        const itemTime = makeDate(item.year, item.month, item.date).getTime()
        return (
          Math.min(t1Time, t2Time) <= itemTime &&
          Math.max(t1Time, t2Time) >= itemTime
        )
      }
    } else if (this.depth === Depth.Year) {
      inRange = (t1: Date, t2: Date) => {
        const t1Time = makeDate(t1.getFullYear(), t1.getMonth(), 1).getTime()
        const t2Time = makeDate(t2.getFullYear(), t2.getMonth(), 1).getTime()
        const itemTime = makeDate(item.year, item.month, 1).getTime()
        return (
          Math.min(t1Time, t2Time) <= itemTime &&
          Math.max(t1Time, t2Time) >= itemTime
        )
      }
    } else if (this.depth === Depth.Decade) {
      inRange = (t1: Date, t2: Date) => {
        return (
          Math.min(t1.getFullYear(), t2.getFullYear()) <= item.year &&
          Math.max(t1.getFullYear(), t2.getFullYear()) >= item.year
        )
      }
    }

    const from = this.rangeFrom
    const to = this.rangeTo ?? this.maybeRangeTo
    if (this.depth === Depth.Month) {
      return inRange!(
        makeDate(from.year, from.month, from.date),
        makeDate(to!.year, to!.month, to!.date)
      )
    }
    if (this.depth === Depth.Year) {
      return inRange!(
        makeDate(from.year, from.month, 1),
        makeDate(to!.year, to!.month, 1)
      )
    }
    if (this.depth === Depth.Decade) {
      return inRange!(makeDate(from.year, 0, 1), makeDate(to!.year, 0, 1))
    }
  }

  // 当前选项是否选中
  #isActiveLeaf(item: DateModel) {
    if (!this.#isLeafDepth()) return false

    if (this.isRangeMode()) {
      return this.#isRangeFrom(item) || this.#isRangeTo(item)
    }

    const isActive =
      this.depth === Depth.Month
        ? this.#isSameDate.bind(this, item)
        : this.depth === Depth.Year
        ? this.#isSameMonth.bind(this, item)
        : this.depth === Depth.Decade
        ? this.#isSameYear.bind(this, item)
        : () => false

    if (this.mode === 'single') {
      return this.#value.some(isActive)
    }

    if (this.mode === 'multiple') {
      return this.#value.some(isActive)
    }
  }

  // 子节点是否包含今天
  #includesToday(item: DateModel) {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    switch (this.viewDepth) {
      case Depth.Year:
        return item.year === year && item.month === month
      case Depth.Decade:
        return item.year === year
      case Depth.Century:
        return Math.floor(year / 10) === item.decade
      default:
        return false
    }
  }

  // 是否有子结点选中（年下的月、日，月下的日等等）
  #includesActive(item: DateModel) {
    if (!this.#value.length) return false

    if (this.isRangeMode()) {
      if (this.#value.length !== 2) return false
      const fromTime = this.#value[0].getTime()
      const toTime = this.#value[1].getTime()
      switch (this.viewDepth) {
        case Depth.Year: {
          const t1 = makeDate(item.year, item.month, 1).getTime()
          const t2 = makeDate(item.year, (item.month ?? 0) + 1, 0).getTime()
          return fromTime <= t2 && toTime >= t1
        }
        case Depth.Decade: {
          const t1 = makeDate(item.year, 0, 1).getTime()
          const t2 = makeDate(item.year, 11, 31).getTime()
          return fromTime <= t2 && toTime >= t1
        }
        case Depth.Century: {
          const t1 = makeDate(item.decade * 10, 0, 1).getTime()
          const t2 = makeDate(item.decade * 10 + 9, 11, 31).getTime()
          return fromTime <= t2 && toTime >= t1
        }
        default:
          return false
      }
    } else {
      switch (this.viewDepth) {
        case Depth.Year:
          return this.#value.some(
            (t: Date) =>
              t.getMonth() === item.month && t.getFullYear() === item.year
          )
        case Depth.Decade:
          return this.#value.some((t: Date) => t.getFullYear() === item.year)
        case Depth.Century:
          return this.#value.some(
            (t: Date) => Math.floor(t.getFullYear() / 10) === item.decade
          )
        default:
          return false
      }
    }
  }

  // 当前是否最深的选择深度
  #isLeafDepth() {
    return this.viewDepth === this.depth
  }

  // 点击选项时的 handler
  #onClickItem(item: DateModel) {
    // 点击 disabled 的末级日期，且该日期非激活状态，则直接返回
    // 如果该日期为激活状态，则可以取消选择（多选时）
    if (this.#isDisabledLeaf(item) && !this.#isActiveLeaf(item)) {
      return
    }

    // 当前非最深层次，直接往下钻入
    if (!this.#isLeafDepth()) {
      return this.drillDown(item)
    }

    this.selectByModel(item)
  }

  // 选中一个日期
  selectDate(date: Date) {
    this.selectByModel(this.#dateToModel(date, this.viewDepth))
  }

  // 选中一个日期项
  selectByModel(item: DateModel) {
    if (this.disabled) return
    let date!: Date
    switch (this.viewDepth) {
      // 月视图，当前操作是选择天
      case Depth.Month: {
        date = makeDate(item.year, item.month, item.date)
        break
      }
      // 年视图，当前操作是选择月
      case Depth.Year: {
        date = makeDate(item.year, item.month, 1)
        break
      }
      // 年代视图，当前操作是选择年
      case Depth.Decade: {
        makeDate(item.year, 0, 1)
        break
      }
    }
    switch (this.mode) {
      // 单选模式
      case 'single': {
        this.setValue(date)
        break
      }
      // 区间模式
      case 'range': {
        this.maybeRangeTo = null
        // 开始新的区间
        if (!this.rangeFrom || this.rangeTo) {
          this.clearValue()
          this.rangeFrom = item
          this.render()
          return
        }
        // 结束区间
        this.rangeTo = item
        this.setRange([
          makeDate(
            this.rangeFrom.year,
            this.viewDepth === Depth.Decade ? 0 : this.rangeFrom.month,
            this.viewDepth === Depth.Month ? this.rangeFrom.date : 1
          ),
          makeDate(
            this.rangeTo.year,
            this.viewDepth === Depth.Decade ? 0 : this.rangeTo.month,
            this.viewDepth === Depth.Month ? this.rangeTo.date : 1
          ),
        ])
        break
      }
      // 多选模式
      case 'multiple': {
        const values = this.#value.slice()
        if (this.#isActiveLeaf(item)) {
          const pred =
            this.viewDepth === Depth.Month
              ? (t: Date) =>
                  t.getDate() === item.date &&
                  t.getMonth() === item.month &&
                  t.getFullYear() === item.year
              : this.viewDepth === Depth.Year
              ? (t: Date) =>
                  t.getMonth() === item.month && t.getFullYear() === item.year
              : (t: Date) => t.getFullYear() === item.year
          const index = values.findIndex(pred)
          if (index !== -1) values.splice(index, 1)
        } else {
          values.push(date)
        }
        this.setValues(values)
        break
      }
    }
  }

  // 当前非处于最深的视图层次，则钻入下一级视图
  drillDown(item: DateModel) {
    if (this.#isLeafDepth()) return

    switch (this.viewDepth) {
      // 年 -> 月
      case Depth.Year: {
        this.viewMonth = item.month
        this.viewDepth = Depth.Month
        dispatchEvent(this, 'panel-change', {
          detail: { viewDepth: this.viewDepth },
        })
        break
      }
      // 年代 -> 年
      case Depth.Decade: {
        this.viewDepth = Depth.Year
        this.viewYear = item.year
        dispatchEvent(this, 'panel-change', {
          detail: { viewDepth: this.viewDepth },
        })
        break
      }
      // 世纪 -> 年代
      default: {
        this.viewDepth = Depth.Decade
        this.viewDecade = item.decade
        dispatchEvent(this, 'panel-change', {
          detail: { viewDepth: this.viewDepth },
        })
      }
    }
  }

  // 当前非处于最浅视图层次，则上卷视图
  rollUp() {
    switch (this.viewDepth) {
      // 月 -> 年
      case Depth.Month: {
        const upDepth = normalizeViewDepth(
          Depth.Year,
          this.mindepth,
          this.depth
        )
        if (this.viewDepth !== upDepth) {
          this.viewDepth = upDepth
          dispatchEvent(this, 'panel-change', {
            detail: { viewDepth: this.viewDepth },
          })
        }
        break
      }
      // 年 -> 年代
      case Depth.Year: {
        const upDepth = normalizeViewDepth(
          Depth.Decade,
          this.mindepth,
          this.depth
        )
        if (this.viewDepth !== upDepth) {
          this.viewDepth = upDepth
          this.switchViewByDate(makeDate(this.viewYear!, 0))
          dispatchEvent(this, 'panel-change', {
            detail: { viewDepth: this.viewDepth },
          })
        }
        break
      }
      // 年代 -> 世纪
      case Depth.Decade: {
        const upDepth = normalizeViewDepth(
          Depth.Century,
          this.mindepth,
          this.depth
        )
        if (this.viewDepth !== upDepth) {
          this.viewDepth = upDepth
          this.switchViewByDate(makeDate(this.viewDecade * 10, 0))
          dispatchEvent(this, 'panel-change', {
            detail: { viewDepth: this.viewDepth },
          })
        }
        break
      }
    }
  }

  // 仅限 year、month、date 三种 item
  #modelToDate(item: DateModel) {
    return makeDate(item.year, item.month || 0, item.date || 1)
  }

  #dateToModel(dateObj: Date, depth: Depth): DateModel {
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth()
    const date = dateObj.getDate()
    const century = Math.floor(year / 100)
    const decade = Math.floor(year / 10)
    const label =
      depth === Depth.Month
        ? String(date)
        : depth === Depth.Year
        ? String(month + 1)
        : depth === Depth.Decade
        ? String(year)
        : `${decade * 10} ~ ${decade * 10 + 9}`
    return {
      label,
      century,
      decade,
      year,
      month,
      date,
    }
  }

  // 显示上个月的选项
  showPrevMonth() {
    if (this.viewMonth == null) return
    if (this.viewMonth > 0) {
      this.viewMonth--
    } else {
      if (this.viewYear) {
        this.viewYear--
      }
      this.viewMonth = 11
    }
    dispatchEvent(this, 'prev-month', {
      detail: {
        century: this.viewCentury,
        decade: this.viewDecade,
        year: this.viewYear,
        month: this.viewMonth,
      },
    })
  }

  // 显示下个月的选项
  showNextMonth() {
    if (this.viewMonth == null) return
    if (this.viewMonth < 11) {
      this.viewMonth++
    } else {
      if (this.viewYear) {
        this.viewYear++
      }
      this.viewMonth = 0
    }
    dispatchEvent(this, 'next-month', {
      detail: {
        century: this.viewCentury,
        decade: this.viewDecade,
        year: this.viewYear,
        month: this.viewMonth,
      },
    })
  }

  // 显示上一年的选项
  showPrevYear() {
    if (this.viewYear == null) return
    this.viewYear--
    dispatchEvent(this, 'prev-year', {
      detail: {
        century: this.viewCentury,
        decade: this.viewDecade,
        year: this.viewYear,
      },
    })
  }

  // 显示下一年的选项
  showNextYear() {
    if (this.viewYear == null) return
    this.viewYear++
    dispatchEvent(this, 'next-year', {
      detail: {
        century: this.viewCentury,
        decade: this.viewDecade,
        year: this.viewYear,
      },
    })
  }

  // 显示上个年代（十年）的选项
  showPrevDecade() {
    this.viewDecade--
    dispatchEvent(this, 'prev-decade', {
      detail: { century: this.viewCentury, decade: this.viewDecade },
    })
  }

  // 显示下个年代（十年）的选项
  showNextDecade() {
    this.viewDecade++
    dispatchEvent(this, 'next-decade', {
      detail: { century: this.viewCentury, decade: this.viewDecade },
    })
  }

  // 显示上一个世纪的选项
  showPrevCentury() {
    this.viewCentury--
    dispatchEvent(this, 'prev-century', {
      detail: { century: this.viewCentury },
    })
  }

  // 显示下一个世纪的选项
  showNextCentury() {
    this.viewCentury++
    dispatchEvent(this, 'next-century', {
      detail: { century: this.viewCentury },
    })
  }

  // 点击 prev 按钮
  #onPrev() {
    if (this.viewDepth === Depth.Month) {
      this.showPrevMonth()
    } else if (this.viewDepth === Depth.Year) {
      this.showPrevYear()
    } else if (this.viewDepth === Depth.Decade) {
      this.showPrevDecade()
    } else {
      this.showPrevCentury()
    }
  }

  // 点击双重 prev 按钮
  #onPrevPrev() {
    if (this.viewDepth === Depth.Month) {
      this.showPrevYear()
    }
  }

  // 点击 next 按钮
  #onNext() {
    if (this.viewDepth === Depth.Month) {
      this.showNextMonth()
    } else if (this.viewDepth === Depth.Year) {
      this.showNextYear()
    } else if (this.viewDepth === Depth.Decade) {
      this.showNextDecade()
    } else {
      this.showNextCentury()
    }
  }

  // 点击双重 next 按钮
  #onNextNext() {
    if (this.viewDepth === Depth.Month) {
      this.showNextYear()
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.render()
  }

  static get Depth() {
    return Depth
  }

  static override get observedAttributes() {
    return [
      // 选择值的深度
      // month 代表最深按照月展示选项，可以选择到 “天”
      // year 代表最深按照年份展示选项，可以选择到 “月”
      // decade 代表最深按照十年展示选项，可以选择到 “年”
      'depth',
      // 是否禁用
      'disabled',
      // 是否使用 loading 遮罩
      'loading',
      // 多选模式的话，最多能选择多少个值
      'max',
      // 可切换至的最小深度
      'mindepth',
      // 选择模式，支持 single, multiple, range
      'mode',
      // 初始化显示的深度
      'startdepth',
      // 每周从星期几开始，0 代表星期天，1 代表星期一，顺序类推
      'start-week-on',
      // model 值
      'value',
    ]
  }
}
