import type { ComponentEventListener } from '../component/Component.js'
import type { DecadeModel, MaybeLeafModel, YearModel, MonthModel, DayModel, ItemModel, MaybeLeafDepth } from './type.js'
import type { EnumAttr } from '../../decorators/attr.js'
import type { ISelectListEventMap, ISelected } from '../../common/connectSelectable.js'
import '../loading/index.js'
import { attr } from '../../decorators/attr.js'
import { boolSetter, enumGetter, enumSetter } from '../../common/property.js'
import { compile } from '../../common/dateFormat.js'
import { computed } from '../../common/reactive.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { fromAttr } from '../component/reactive.js'
import { style } from './style.js'
import { template } from './template.js'
import { Control } from '../base-control/index.js'
import { Depth } from './type.js'
import * as Helpers from './helpers.js'

interface DateEventMap extends ISelectListEventMap {
  change: CustomEvent<{ selected: Date[] }>
  'panel-change': CustomEvent<{ activeDepth: Depth }>
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
  'active-depth-change': CustomEvent<{ value: Depth }>
  'badges-change': CustomEvent<{ value: Badge[] }>
}

type Badge = { year: number; month?: number; date?: number; label?: string }

type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0

export interface BlocksDate extends Control {
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

@defineClass({
  customElement: 'bl-date',
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
export class BlocksDate extends Control {
  static override get observedAttributes() {
    return ['value']
  }

  static get Depth() {
    return Depth
  }

  /** 是否使用 loading 遮罩 */
  @attr('boolean') accessor loading!: boolean

  /** 多选模式的话，最多能选择多少个值 */
  @attr('int') accessor max!: number | null

  /** 选择模式，支持 single, multiple, range */
  @attr('enum', { enumValues: ['single', 'multiple', 'range'] })
  accessor mode: EnumAttr<['single', 'multiple', 'range']> = 'single'

  /**
   * 选择值的深度
   * 用于确定哪一层级深度的面板是最终层级，用于 emit 值，具体：
   * 值为 Depth.Month 时，代表最深按照月展示选项，用于选择“日”
   * 值为 Depth.Year 时，代表最深按照年份展示选项，用于选择“月”
   * 值为 Depth.Decade 时，代表最深按照十年展示选项，用于选择“年”
   */
  @attr('enum', { enumValues: Helpers.LeafDepths })
  accessor depth: MaybeLeafDepth = Depth.Month

  /**
   * 可切换至的最小深度
   * 往上最小层级深度，如：
   * 当前处于月面板，最小层级为年，则点击标题栏最多可以往上切换到年份面板，而无法继续往上切换到十年、世纪面板视图
   */
  @attr('string', {
    get(element: BlocksDate) {
      const value = enumGetter('mindepth', Helpers.Depths)(element) ?? Depth.Century
      return Helpers.normalizeMinDepth(value, element.depth)
    },
    set(element: BlocksDate, value: Depth) {
      if (Helpers.Depths.includes(value)) {
        enumSetter('mindepth', Helpers.Depths)(element, Helpers.normalizeMinDepth(value, element.depth))
      }
    },
  })
  accessor minDepth!: Depth

  /**
   * 组件初始化的时候，展示哪个层级深度的面板
   */
  @attr('string', {
    get(element: BlocksDate) {
      const value = enumGetter('startdepth', Helpers.Depths)(element) ?? element.depth
      return Helpers.normalizeActiveDepth(value, element.minDepth, element.depth)
    },
    set(element: BlocksDate, value: Depth) {
      if (Helpers.Depths.includes(value)) {
        enumSetter('startdepth', Helpers.Depths)(
          element,
          Helpers.normalizeActiveDepth(value, element.minDepth, element.depth)
        )
      }
    },
  })
  accessor startDepth!: Depth

  // 每周从星期几开始，0 代表星期天，1 代表星期一，顺序类推
  @attr('string', {
    get(element: BlocksDate) {
      const value = enumGetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(element) ?? '1'
      return Number(value) as WeekNumber
    },
    set(element: BlocksDate, value: Depth) {
      enumSetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(element, String(value))
    },
  })
  accessor startWeekOn!: WeekNumber

  @attr('string', { defaults: 'YYYY-MM-DD' }) accessor format!: string
  #formatter = computed(format => compile(format), [fromAttr(this, 'format')])

  @shadowRef('[part="layout"]') accessor $layout!: HTMLElement
  @shadowRef('.header-title') accessor $title!: HTMLButtonElement
  @shadowRef('.button-prevPrev') accessor $prevPrev!: HTMLButtonElement
  @shadowRef('.button-prev') accessor $prev!: HTMLButtonElement
  @shadowRef('.button-nextNext') accessor $nextNext!: HTMLButtonElement
  @shadowRef('.button-next') accessor $next!: HTMLButtonElement
  @shadowRef('.week-header') accessor $weekHeader!: HTMLElement
  @shadowRef('#body') accessor $content!: HTMLElement
  @shadowRef('.button-list') accessor $list!: HTMLElement
  @shadowRef('.body-loading') accessor $loading!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())
    this._tabIndexFeature.withTabIndex(null)

    // 面板视图深度层级
    this.activeDepth = this.startDepth

    this.#setupInitViewData()
    this.#setupNavButtons()
    this.#setupTitle()
    this.#setupDateButtons()
    this.#setupWeekHeader()
    this.#setupLoading()
    this.#setupFocus()

    this.onConnected(this.render)
    this.onAttributeChanged(this.render)
  }

  // 按钮元素池
  #$pool: HTMLButtonElement[] = []

  // 选中值
  #selected: Date[] = []

  get selected() {
    return this.#selected
  }

  set selected(values: Date[]) {
    let newValues: Date[]
    let currentValues: Date[]

    switch (this.mode) {
      case 'single': {
        newValues = values[0] instanceof Date ? values.slice(0, 1) : []
        currentValues = this.#selected.slice(0, 1)
        break
      }

      case 'multiple': {
        newValues = (values.every(value => value instanceof Date) ? values : []).slice(0, this.max ?? Infinity)
        currentValues = this.#selected
        break
      }

      case 'range': {
        newValues = (
          values.length === 2 &&
          values.every(date => {
            return date instanceof Date && Helpers.maybeLeafModel(this.#dateToModel(date))
          })
            ? values
            : []
        ).sort((a, b) => a.getTime() - b.getTime())
        currentValues = this.#selected
        break
      }
    }

    // 没变化
    if (
      currentValues.length === newValues.length &&
      currentValues.every((date, i) => this.dateEquals(date, newValues[i]))
    ) {
      return
    }

    this.#selected = newValues

    if (this.mode === 'range') {
      if (!newValues.length) {
        this.rangeFrom = this.rangeTo = this.maybeRangeTo = null
      } else {
        this.rangeFrom = this.#dateToModel(newValues[0]) as MaybeLeafModel
        this.rangeTo = this.#dateToModel(newValues[1]) as MaybeLeafModel
        this.maybeRangeTo = null
      }
    }

    this.render()
    this.#notifyChange()
  }

  get selectedCount() {
    return this.#selected.length
  }

  /**
   * 当前渲染的面板深度
   */
  #activeDepth?: any
  get activeDepth() {
    return Helpers.normalizeActiveDepth(this.#activeDepth, this.minDepth, this.depth)
  }

  set activeDepth(value) {
    if (this.#activeDepth === value) return
    this.#activeDepth = Helpers.normalizeActiveDepth(value, this.minDepth, this.depth)
    dispatchEvent(this, 'active-depth-change', { detail: { value } })
  }

  // 世纪视图时，展示哪个世纪的选项
  // 没有设置时，默认取年份的，年份也没有设置时，取当前年的
  #activeCentury?: number
  get activeCentury() {
    if (this.#activeCentury != null) return this.#activeCentury
  }
  set activeCentury(value) {
    const century = Helpers.normalizeNumber(value)
    if (century == null) return
    if (this.#activeCentury !== century) {
      this.#activeCentury = century
      dispatchEvent(this, 'active-century-change', { detail: { century } })
    }
  }

  // 十年视图时，展示哪个十年的选项
  // 没有设置时，默认取年份的，年份也没有设置时，取当前年的
  #activeDecade?: number
  get activeDecade() {
    if (this.#activeDecade != null) return this.#activeDecade
  }
  set activeDecade(value) {
    const decade = Helpers.normalizeNumber(value)
    if (decade == null) return
    if (this.#activeDecade !== decade) {
      this.#activeDecade = decade
      dispatchEvent(this, 'active-decade-change', { detail: { decade } })
    }
  }

  // 年度视图，显示哪个年度的数据
  #activeYear?: number
  get activeYear() {
    return this.#activeYear
  }
  set activeYear(value) {
    const year = Helpers.normalizeNumber(value)
    if (year == null) return
    if (this.#activeYear !== year) {
      this.#activeYear = year
      dispatchEvent(this, 'active-year-change', { detail: { year } })
    }
  }

  // 月度视图，显示哪个月的数据
  #activeMonth?: number
  get activeMonth() {
    return this.#activeMonth
  }
  set activeMonth(value) {
    const month = Helpers.normalizeNumber(value)
    if (month == null) return
    if (this.#activeMonth !== month) {
      this.#activeMonth = month
      dispatchEvent(this, 'active-month-change', { detail: { month } })
    }
  }

  /** range 模式，设置 range 起点 */
  #rangeFrom?: MaybeLeafModel | null
  get rangeFrom() {
    return this.#rangeFrom
  }
  set rangeFrom(value) {
    this.#rangeFrom = value
    dispatchEvent(this, 'range-from-change', { detail: { value } })
  }

  /** range 模式，设置 range 终点 */
  #rangeTo?: MaybeLeafModel | null

  /** range 模式，设置了 rangeFrom 但还没设置 rangeTo 时，鼠标移动到其他的日期上，需要渲染预览效果 */
  #maybeRangeTo?: MaybeLeafModel | null
  get maybeRangeTo() {
    return this.#maybeRangeTo
  }
  set maybeRangeTo(value) {
    this.#maybeRangeTo = value
    dispatchEvent(this, 'maybe-range-to-change', { detail: { value } })
  }

  get rangeTo() {
    return this.#rangeTo
  }
  set rangeTo(value) {
    if (value !== null) {
      this.maybeRangeTo = null
    }
    this.#rangeTo = value
    dispatchEvent(this, 'range-to-change', { detail: { value } })
  }

  #disabledDate?: (
    data: ItemModel,
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
    dispatchEvent(this, 'disabled-date-change')
  }

  #badges?: Badge[]
  get badges(): Badge[] {
    return this.#badges ?? []
  }

  set badges(value: Badge[]) {
    this.#badges = value
    dispatchEvent(this, 'badges-change', { detail: { value } })
  }

  // 面板起始视图状态
  #setupInitViewData() {
    const date = Helpers.getClosestDate(this.selected) ?? new Date()

    switch (this.activeDepth) {
      case Depth.Month: {
        this.activeMonth = date.getMonth()
        this.activeYear = date.getFullYear()
        return
      }
      case Depth.Year: {
        this.activeYear = date.getFullYear()
        return
      }
      case Depth.Decade: {
        this.activeDecade = Helpers.yearToDecade(date.getFullYear())
        return
      }
      case Depth.Century: {
        this.activeCentury = Helpers.yearToCentury(date.getFullYear())
        return
      }
    }
  }

  // 面板顶部导航按钮（前前翻页、前翻页、后翻页、后后翻页）
  #setupNavButtons() {
    const render = () => {
      if (this.activeDepth === Depth.Month) {
        this.$prevPrev.style.cssText = ''
        this.$nextNext.style.cssText = ''
      } else {
        this.$prevPrev.style.cssText = 'transfrom:scale(0,0);flex:0 0 0'
        this.$nextNext.style.cssText = 'transfrom:scale(0,0);flex:0 0 0'
      }
    }
    this.onRender(render)
    this.onConnected(render)
    this.onConnected(() => {
      this.addEventListener('active-depth-change', render)
    })
    this.onDisconnected(() => {
      this.removeEventListener('active-depth-change', render)
    })

    // 点击 prev 按钮
    const onPrev = () => {
      if (this.activeDepth === Depth.Month) {
        this.showPrevMonth()
      } else if (this.activeDepth === Depth.Year) {
        this.showPrevYear()
      } else if (this.activeDepth === Depth.Decade) {
        this.showPrevDecade()
      } else {
        this.showPrevCentury()
      }
    }
    // 点击双重 prev 按钮
    const onPrevPrev = () => {
      if (this.activeDepth === Depth.Month) {
        this.showPrevYear()
      }
    }
    // 点击 next 按钮
    const onNext = () => {
      if (this.activeDepth === Depth.Month) {
        this.showNextMonth()
      } else if (this.activeDepth === Depth.Year) {
        this.showNextYear()
      } else if (this.activeDepth === Depth.Decade) {
        this.showNextDecade()
      } else {
        this.showNextCentury()
      }
    }
    // 点击双重 next 按钮
    const onNextNext = () => {
      if (this.activeDepth === Depth.Month) {
        this.showNextYear()
      }
    }
    this.onConnected(() => {
      this.$prevPrev.onclick = onPrevPrev
      this.$prev.onclick = onPrev
      this.$next.onclick = onNext
      this.$nextNext.onclick = onNextNext
    })
    this.onDisconnected(() => {
      this.$prevPrev.onclick = this.$prev.onclick = this.$next.onclick = this.$nextNext.onclick = null
    })
  }

  // 面板顶部标题（指示当前面板的可选范围）
  #setupTitle() {
    const render = () => {
      let text: string
      switch (this.activeDepth) {
        case Depth.Century: {
          text = `${Helpers.firstYearOfCentury(this.activeCentury!)} ~ ${Helpers.lastYearOfCentury(
            this.activeCentury!
          )}`
          break
        }
        case Depth.Decade: {
          text = `${Helpers.firstYearOfDecade(this.activeDecade!)} ~ ${Helpers.lastYearOfDecade(this.activeDecade!)}`
          break
        }
        case Depth.Year: {
          text = `${this.activeYear}`
          break
        }
        default:
          text = `${this.activeYear} / ${this.activeMonth! + 1}`
      }
      this.$title.textContent = text
    }
    this.onRender(render)
    this.onConnected(render)
    this.onConnected(() => {
      this.addEventListener('active-depth-change', render)
      this.addEventListener('active-century-change', render)
      this.addEventListener('active-decade-change', render)
      this.addEventListener('active-year-change', render)
      this.addEventListener('active-month-change', render)
    })
    this.onDisconnected(() => {
      this.removeEventListener('active-depth-change', render)
      this.removeEventListener('active-century-change', render)
      this.removeEventListener('active-decade-change', render)
      this.removeEventListener('active-year-change', render)
      this.removeEventListener('active-month-change', render)
    })

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (this.$title.contains(target)) {
        this.rollUp()
      }
    }
    this.onConnected(() => {
      this.$layout.addEventListener('click', onClick)
    })
    this.onDisconnected(() => {
      this.$layout.removeEventListener('click', onClick)
    })
  }

  // 星期几标题行（仅在月视图渲染）
  #setupWeekHeader() {
    const render = () => {
      const headers = Helpers.generateWeekHeaders(this.startWeekOn)
      const $weekHeader = this.$weekHeader
      if (this.activeDepth === Depth.Month) {
        $weekHeader.style.height = ''
        $weekHeader.style.opacity = '1'

        if ($weekHeader.children.length !== 7) {
          $weekHeader.innerHTML = headers.map(header => `<span>${header}</span>`).join('')
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
    this.onConnected(render)
    this.onRender(render)
    this.onAttributeChangedDep('start-week-on', render)
    this.onConnected(() => {
      this.addEventListener('active-depth-change', render)
    })
    this.onDisconnected(() => {
      this.removeEventListener('active-depth-change', render)
    })
  }

  // 日期选择按钮
  #setupDateButtons() {
    const getModel = ($item: HTMLElement): ItemModel => {
      return {
        label: $item.dataset.label!,
        century: +$item.dataset.century! || 0,
        decade: +$item.dataset.decade!,
        year: +$item.dataset.year!,
        month: +$item.dataset.month!,
        date: +$item.dataset.date!,
      }
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      let itemModel: ItemModel | undefined
      if (target.classList.contains('button-item')) {
        itemModel = getModel(target)
      } else if ((target.parentElement as HTMLElement)?.classList.contains('button-item')) {
        itemModel = getModel(target.parentElement!)
      }
      if (typeof itemModel?.year === 'number') {
        // 点击 disabled 的末级日期，且该日期非激活状态，则直接返回
        // 如果该日期为激活状态，则可以取消选择（多选时）
        if (isDisabledLeaf(itemModel) && !this.#isActiveLeaf(itemModel)) {
          return
        }
        // 当前非最深层次，直接往下钻入
        if (!this.#isLeafDepth()) {
          return this.drillDown(itemModel)
        }
        // 达到可选的最深层次，则执行选择或者取消选择
        this.#selectByLeafModel(itemModel)
      }
    }
    // range 选择模式，鼠标移入，渲染选中效果
    const onMouseOver = (e: MouseEvent) => {
      if (!this.#isLeafDepth()) return
      if (!this.#isRangeMode()) return
      if (!this.rangeFrom) return
      if (this.rangeTo) return
      const target = e.target as HTMLElement
      const $button = target.classList.contains('button-item')
        ? target
        : (target.parentElement as HTMLElement).classList.contains('button-item')
        ? (target.parentElement as HTMLElement)
        : null
      if (!$button) return
      this.maybeRangeTo = getModel($button) as MaybeLeafModel
      render()
    }
    this.onConnected(() => {
      this.$layout.addEventListener('click', onClick)
      this.$layout.addEventListener('mouseover', onMouseOver)
    })
    this.onDisconnected(() => {
      this.$layout.removeEventListener('click', onClick)
      this.$layout.removeEventListener('mouseover', onMouseOver)
    })

    // 子节点是否包含今天
    const includesToday = (item: ItemModel) => {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      switch (this.activeDepth) {
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
    const includesActive = (itemModel: ItemModel) => {
      if (!this.selectedCount) return false

      if (this.#isRangeMode()) {
        if (this.selectedCount !== 2) return false
        const [fromTime, toTime] = this.selected.map(date => date.getTime())

        switch (this.activeDepth) {
          case Depth.Year: {
            itemModel = itemModel as MonthModel
            const t1 = Helpers.makeDate(itemModel.year, itemModel.month, 1).getTime()
            const t2 = Helpers.makeDate(itemModel.year, (itemModel.month ?? 0) + 1, 0).getTime()
            return fromTime <= t2 && toTime >= t1
          }
          case Depth.Decade: {
            itemModel = itemModel as YearModel
            const t1 = Helpers.makeDate(itemModel.year, 0, 1).getTime()
            const t2 = Helpers.makeDate(itemModel.year, 11, 31).getTime()
            return fromTime <= t2 && toTime >= t1
          }
          case Depth.Century: {
            itemModel = itemModel as DecadeModel
            const t1 = Helpers.makeDate(itemModel.decade * 10, 0, 1).getTime()
            const t2 = Helpers.makeDate(itemModel.decade * 10 + 9, 11, 31).getTime()
            return fromTime <= t2 && toTime >= t1
          }
          default:
            return false
        }
      } else {
        switch (this.activeDepth) {
          case Depth.Year:
            return this.selected.some(
              (t: Date) => t.getMonth() === itemModel.month && t.getFullYear() === itemModel.year
            )
          case Depth.Decade:
            return this.selected.some((t: Date) => t.getFullYear() === itemModel.year)
          case Depth.Century:
            return this.selected.some((t: Date) => Math.floor(t.getFullYear() / 10) === itemModel.decade)
          default:
            return false
        }
      }
    }

    // 当前选项是否渲染成禁用，仅作用于末级 depth
    const isDisabledLeaf = (item: ItemModel) => {
      // 对于多选，需要检查是否抵达数量上限
      if (this.#limitReached()) return true

      // 如果外部传入了 disabledDate 检查
      // 校验（depth 末级）选项是否可用
      if (this.disabledDate) {
        return this.disabledDate(item, {
          depth: this.depth,
          viewDepth: this.activeDepth,
          component: this,
        })
      } else {
        if (this.activeDepth !== this.depth) return false
        return false
      }
    }

    // 只保留 N 个日期选择按钮
    const ensureItemCount = (n: number) => {
      const $list = this.$list
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
        this.#$pool.push($list.removeChild($list.lastElementChild as HTMLButtonElement))
      }
      return Array.prototype.slice.call($list.children)
    }

    // 渲染世纪视图（十年选择按钮）
    const renderCenturyView = () => {
      const decades = Helpers.generateDecades(this.activeCentury!)
      if (!decades.length) return
      ensureItemCount(10).forEach(($el, i) => {
        const itemModel = decades[i]
        boolSetter('disabled')($el, false)
        $el.classList.toggle('button-item--otherMonth', false)
        $el.classList.toggle('button-item--today', false)
        $el.classList.toggle('button-item--active', false)
        $el.classList.toggle('button-item--includesActive', includesActive(itemModel))
        $el.classList.toggle('button-item--includesToday', includesToday(itemModel))
        $el.classList.toggle('button-item--rangeFrom', false)
        $el.classList.toggle('button-item--rangeTo', false)
        $el.classList.toggle('button-item--rangeIn', false)

        $el.dataset.century = itemModel.century
        $el.dataset.decade = itemModel.decade
        $el.dataset.year = null
        $el.dataset.month = null
        $el.dataset.date = null
        $el.dataset.label = itemModel.label

        $el.lastElementChild.innerHTML = itemModel.label
        renderBadge($el, itemModel)
      })
    }

    // 渲染十年视图（年度选择按钮）
    const renderDecadeView = () => {
      const years = Helpers.generateYears(Helpers.decadeToCentury(this.activeDecade!), this.activeDecade!)
      if (!years.length) return
      ensureItemCount(10).forEach(($el, i) => {
        const itemModel = years[i]
        if (this.depth === Depth.Decade) {
          boolSetter('disabled')($el, !this.#isActiveLeaf(itemModel) && isDisabledLeaf(itemModel))
        } else {
          boolSetter('disabled')($el, false)
        }
        $el.classList.toggle('button-item--otherMonth', false)
        $el.classList.toggle('button-item--today', false)
        $el.classList.toggle('button-item--active', this.#isActiveLeaf(itemModel))
        $el.classList.toggle('button-item--includesActive', includesActive(itemModel))
        $el.classList.toggle('button-item--includesToday', includesToday(itemModel))

        const isRangeMode = this.#isRangeMode()
        $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(itemModel))
        $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(itemModel))
        $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(itemModel))

        $el.dataset.century = itemModel.century
        $el.dataset.decade = itemModel.decade
        $el.dataset.year = itemModel.year
        $el.dataset.month = null
        $el.dataset.date = null
        $el.dataset.label = itemModel.label

        $el.lastElementChild.innerHTML = itemModel.label
        renderBadge($el, itemModel)
      })
    }

    // 渲染年视图（月份选择按钮）
    const renderYearView = () => {
      const months = Helpers.generateMonths(
        Helpers.yearToCentury(this.activeYear!),
        Helpers.yearToDecade(this.activeYear!),
        this.activeYear!
      )
      if (!months.length) return
      ensureItemCount(12).forEach(($el, i) => {
        const itemModel = months[i]
        $el.classList.toggle('button-item--otherMonth', false)
        $el.classList.toggle('button-item--today', false)
        $el.classList.toggle('button-item--active', this.#isActiveLeaf(itemModel))
        $el.classList.toggle('button-item--includesActive', includesActive(itemModel))
        $el.classList.toggle('button-item--includesToday', includesToday(itemModel))

        const isRangeMode = this.#isRangeMode()
        $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(itemModel))
        $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(itemModel))
        $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(itemModel))

        if (this.depth === Depth.Year) {
          boolSetter('disabled')($el, !this.#isActiveLeaf(itemModel) && isDisabledLeaf(itemModel))
        } else {
          boolSetter('disabled')($el, false)
        }
        $el.dataset.century = itemModel.century
        $el.dataset.decade = itemModel.decade
        $el.dataset.year = itemModel.year
        $el.dataset.month = itemModel.month
        $el.dataset.date = null
        $el.dataset.label = itemModel.label
        $el.lastElementChild.innerHTML = itemModel.label
        renderBadge($el, itemModel)
      })
    }

    // 渲染月视图（日期选择按钮）
    const renderMonthView = () => {
      const dateList = Helpers.generateDates(
        Helpers.yearToCentury(this.activeYear!),
        Helpers.yearToDecade(this.activeYear!),
        this.activeYear!,
        this.activeMonth!,
        this.startWeekOn
      )
      if (!dateList.length) return
      ensureItemCount(42).forEach(($el, i) => {
        const itemModel = dateList[i]
        boolSetter('disabled')($el, !this.#isActiveLeaf(itemModel) && isDisabledLeaf(itemModel))
        // 月视图中，根据周起始日，可能包含上月末的几天，
        // 以及下月初的某几天，为这些非当前视图对应的日期按钮应用弱化样式
        $el.classList.toggle('button-item--otherMonth', itemModel.month !== this.activeMonth)
        $el.classList.toggle('button-item--today', Helpers.isToday(itemModel))
        $el.classList.toggle('button-item--active', this.#isActiveLeaf(itemModel))
        $el.classList.toggle('button-item--includesActive', false)
        $el.classList.toggle('button-item--includesToday', includesToday(itemModel))

        const isRangeMode = this.#isRangeMode()
        $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(itemModel))
        $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(itemModel))
        $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(itemModel))

        $el.dataset.century = itemModel.century
        $el.dataset.decade = itemModel.decade
        $el.dataset.year = itemModel.year
        $el.dataset.month = itemModel.month
        $el.dataset.date = itemModel.date
        $el.dataset.label = itemModel.label

        $el.lastElementChild.innerHTML = itemModel.label
        renderBadge($el, itemModel)
      })
    }

    // 日期按钮上渲染事件标志
    const renderBadge = ($el: HTMLElement, itemModel: ItemModel) => {
      const badges = this.getBadges(itemModel)
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

    const render = () => {
      ;['body-century', 'body-decade', 'body-year', 'body-month'].forEach(klass => {
        this.$content.classList.remove(klass)
      })
      this.$content.classList.add(`body-${this.activeDepth}`)

      if (this.activeDepth === Depth.Month) {
        renderMonthView()
      } else if (this.activeDepth === Depth.Year) {
        renderYearView()
      } else if (this.activeDepth === Depth.Decade) {
        renderDecadeView()
      } else if (this.activeDepth === Depth.Century) {
        renderCenturyView()
      }
    }

    this.onRender(render)
    this.onConnected(render)
    this.onConnected(() => {
      this.addEventListener('badges-change', render)
      this.addEventListener('active-depth-change', render)
      this.addEventListener('active-century-change', render)
      this.addEventListener('active-decade-change', render)
      this.addEventListener('active-year-change', render)
      this.addEventListener('active-month-change', render)
      this.addEventListener('disabled-date-change', render)
    })
    this.onDisconnected(() => {
      this.removeEventListener('badges-change', render)
      this.removeEventListener('active-depth-change', render)
      this.removeEventListener('active-century-change', render)
      this.removeEventListener('active-decade-change', render)
      this.removeEventListener('active-year-change', render)
      this.removeEventListener('active-month-change', render)
      this.removeEventListener('disabled-date-change', render)
    })
  }

  // loading 状态
  #setupLoading() {
    const render = () => {
      this.$loading.style.display = this.loading ? '' : 'none'
    }
    this.onRender(render)
    this.onConnected(render)
    this.onAttributeChangedDep('loading', render)
  }

  #setupFocus() {
    const onClick = () => this.focus()
    this.onConnected(() => {
      this.$layout.addEventListener('click', onClick)
    })
    this.onConnected(() => {
      this.$layout.removeEventListener('click', onClick)
    })
  }

  /** 取消未完成的 range 选择状态 */
  clearUncompleteRange() {
    if (this.mode !== 'range') return
    if (this.selected.length === 2) {
      const [from, to] = this.selected as [Date, Date]
      const fromModel = this.#dateToModel(from)
      const toModel = this.#dateToModel(to)
      this.rangeFrom = fromModel as MaybeLeafModel
      this.rangeTo = toModel as MaybeLeafModel
    } else {
      this.rangeFrom = this.rangeTo = null
    }
    this.render()
  }

  /** 清空当前的选择值 */
  // ISelectableListComponent
  clearSelected() {
    this.selected = []
  }

  // ISelectableListComponent
  deselect(selected: ISelected) {
    const date = selected.value
    this.selected = this.selected.filter(value => !this.dateEquals(value, date))
  }

  // 支持 ISelectableListComponent
  notifySelectListChange() {
    const value = this.selected.map(date => {
      return {
        value: date,
        label: this.#formatter.content(date),
      }
    })
    dispatchEvent(this, 'select-list:change', {
      detail: { value },
    })
  }

  #notifyChange() {
    this.notifySelectListChange()
    dispatchEvent(this, 'change', { detail: { selected: this.selected } })
  }

  #isRangeMode() {
    return this.mode === 'range'
  }

  // 是否已经选够最大数量的值
  #limitReached() {
    if (this.mode !== 'multiple' || !this.max) return false
    let max = Math.trunc(Math.abs(this.max))
    if (max < 1) max = 1
    const len = this.selected.length ?? 0
    return len >= max
  }

  #isRangeFrom(itemModel: ItemModel) {
    let obj = this.rangeFrom
    if (!obj) return false
    const obj2 = this.rangeTo ?? this.maybeRangeTo
    // 先选大，再选小的情况
    if (obj2 && this.#leafModelToDate(obj).getTime() > this.#leafModelToDate(obj2).getTime()) {
      obj = obj2
    }
    return ['year', 'month', 'date'].every(key => (obj as any)[key] === (itemModel as any)[key])
  }

  #isRangeTo(itemModel: ItemModel) {
    let obj = this.rangeFrom
    if (!obj) return false
    const obj2 = this.rangeTo ?? this.maybeRangeTo
    // 先选大，再选小的情况
    if (obj2 && this.#leafModelToDate(obj).getTime() < this.#leafModelToDate(obj2).getTime()) {
      obj = obj2
    }
    return ['year', 'month', 'date'].every(key => (obj as any)[key] === (itemModel as any)[key])
  }

  #isInRange(itemModel: ItemModel) {
    if (!this.#isLeafDepth()) return false
    if (!this.rangeFrom) return false
    if (!this.rangeTo && !this.maybeRangeTo) return false
    let inRange: (t1: Date, t2: Date) => boolean
    if (this.depth === Depth.Month) {
      const model = itemModel as DayModel
      inRange = (t1: Date, t2: Date) => {
        const t1Time = Helpers.makeDate(t1.getFullYear(), t1.getMonth(), t1.getDate()).getTime()
        const t2Time = Helpers.makeDate(t2.getFullYear(), t2.getMonth(), t2.getDate()).getTime()
        const itemTime = Helpers.makeDate(model.year, model.month, model.date).getTime()
        return Math.min(t1Time, t2Time) <= itemTime && Math.max(t1Time, t2Time) >= itemTime
      }
    } else if (this.depth === Depth.Year) {
      const model = itemModel as MonthModel
      inRange = (t1: Date, t2: Date) => {
        const t1Time = Helpers.makeDate(t1.getFullYear(), t1.getMonth(), 1).getTime()
        const t2Time = Helpers.makeDate(t2.getFullYear(), t2.getMonth(), 1).getTime()
        const itemTime = Helpers.makeDate(model.year, model.month, 1).getTime()
        return Math.min(t1Time, t2Time) <= itemTime && Math.max(t1Time, t2Time) >= itemTime
      }
    } else if (this.depth === Depth.Decade) {
      const model = itemModel as YearModel
      inRange = (t1: Date, t2: Date) => {
        return (
          Math.min(t1.getFullYear(), t2.getFullYear()) <= model.year &&
          Math.max(t1.getFullYear(), t2.getFullYear()) >= model.year
        )
      }
    } else {
      // DecadeModel 无法作为选中值，因此，decade 项不会是 in range。
      inRange = () => false
    }

    const from = this.rangeFrom
    const to = this.rangeTo ?? this.maybeRangeTo
    if (this.depth === Depth.Month) {
      return inRange(
        Helpers.makeDate(from.year, from.month, from.date),
        Helpers.makeDate(to!.year, to!.month, to!.date)
      )
    }
    if (this.depth === Depth.Year) {
      return inRange(Helpers.makeDate(from.year, from.month, 1), Helpers.makeDate(to!.year, to!.month, 1))
    }
    if (this.depth === Depth.Decade) {
      return inRange(Helpers.makeDate(from.year, 0, 1), Helpers.makeDate(to!.year, 0, 1))
    }
  }

  // 当前选项是否选中（选中的项或者区间的端点）
  #isActiveLeaf(itemModel: ItemModel) {
    if (!this.#isLeafDepth()) return false

    if (this.#isRangeMode()) {
      return this.#isRangeFrom(itemModel) || this.#isRangeTo(itemModel)
    }

    const isSameDate = (item: ItemModel, date: Date) => {
      return date.getFullYear() === item.year && date.getMonth() === item.month && date.getDate() === item.date
    }
    const isSameMonth = (item: ItemModel, date: Date) => {
      return date.getFullYear() === item.year && date.getMonth() === item.month
    }
    const isSameYear = (item: ItemModel, date: Date) => {
      return date.getFullYear() === item.year
    }
    const isActive =
      this.depth === Depth.Month
        ? isSameDate.bind(this, itemModel)
        : this.depth === Depth.Year
        ? isSameMonth.bind(this, itemModel)
        : this.depth === Depth.Decade
        ? isSameYear.bind(this, itemModel)
        : () => false

    if (this.mode === 'single') {
      return this.selected.some(isActive)
    }

    if (this.mode === 'multiple') {
      return this.selected.some(isActive)
    }
  }

  // 当前是否最深的选择深度
  #isLeafDepth() {
    return this.activeDepth === this.depth
  }

  // 选中一个日期
  selectByDate(date: Date) {
    const itemModel = Helpers.dateToModel(date, this.depth) as MaybeLeafModel
    this.#selectByLeafModel(itemModel)
  }

  // 选中一个日期项
  #selectByLeafModel(itemModel: MaybeLeafModel) {
    if (this.disabled) return
    const date = Helpers.modelToDate(itemModel, this.depth)

    switch (this.mode) {
      // 单选模式
      case 'single': {
        this.selected = [date]
        break
      }
      // 多选模式
      case 'multiple': {
        const values = this.selected.slice()
        if (this.#isActiveLeaf(itemModel)) {
          const pred =
            this.activeDepth === Depth.Month
              ? (t: Date) =>
                  t.getDate() === itemModel.date &&
                  t.getMonth() === itemModel.month &&
                  t.getFullYear() === itemModel.year
              : this.activeDepth === Depth.Year
              ? (t: Date) => t.getMonth() === itemModel.month && t.getFullYear() === itemModel.year
              : (t: Date) => t.getFullYear() === itemModel.year
          const index = values.findIndex(pred)
          if (index !== -1) values.splice(index, 1)
        } else {
          values.push(date)
        }
        this.selected = values
        break
      }
      // 区间模式
      case 'range': {
        this.maybeRangeTo = null
        // 开始新的区间
        if (!this.rangeFrom || this.rangeTo) {
          this.selected = []
          this.rangeFrom = itemModel
          this.render()
          return
        }
        // 结束区间
        this.rangeTo = itemModel
        this.selected = [
          Helpers.makeDate(
            this.rangeFrom.year,
            this.activeDepth === Depth.Decade ? 0 : this.rangeFrom.month,
            this.activeDepth === Depth.Month ? this.rangeFrom.date : 1
          ),
          Helpers.makeDate(
            this.rangeTo.year,
            this.activeDepth === Depth.Decade ? 0 : this.rangeTo.month,
            this.activeDepth === Depth.Month ? this.rangeTo.date : 1
          ),
        ]
        break
      }
    }
  }

  // 当前非处于最深的视图层次，则钻入下一级视图
  drillDown(itemModel: ItemModel) {
    if (this.#isLeafDepth()) return

    switch (this.activeDepth) {
      // 年 -> 月
      case Depth.Year: {
        this.activeCentury = undefined
        this.activeDecade = undefined
        this.activeYear = (itemModel as MonthModel).year
        this.activeMonth = (itemModel as MonthModel).month
        this.activeDepth = Depth.Month
        dispatchEvent(this, 'panel-change', {
          detail: { activeDepth: this.activeDepth },
        })
        break
      }
      // 年代 -> 年
      case Depth.Decade: {
        this.activeCentury = undefined
        this.activeDecade = undefined
        this.activeYear = (itemModel as YearModel).year
        this.activeMonth = undefined

        this.activeDepth = Depth.Year
        dispatchEvent(this, 'panel-change', {
          detail: { activeDepth: this.activeDepth },
        })
        break
      }
      // 世纪 -> 年代
      default: {
        this.activeCentury = undefined
        this.activeDecade = (itemModel as DecadeModel).decade
        this.activeYear = undefined
        this.activeMonth = undefined

        this.activeDepth = Depth.Decade
        dispatchEvent(this, 'panel-change', {
          detail: { activeDepth: this.activeDepth },
        })
      }
    }
  }

  // 当前非处于最浅视图层次，则上卷视图
  rollUp() {
    switch (this.activeDepth) {
      // 月 -> 年
      case Depth.Month: {
        const upDepth = Helpers.normalizeActiveDepth(Depth.Year, this.minDepth, this.depth)
        if (this.activeDepth !== upDepth) {
          this.activeCentury = undefined
          this.activeDecade = undefined
          this.activeYear = this.activeYear
          this.activeMonth = undefined

          this.activeDepth = upDepth
          dispatchEvent(this, 'panel-change', {
            detail: { activeDepth: this.activeDepth },
          })
        }
        break
      }
      // 年 -> 年代
      case Depth.Year: {
        const upDepth = Helpers.normalizeActiveDepth(Depth.Decade, this.minDepth, this.depth)
        if (this.activeDepth !== upDepth) {
          this.activeCentury = undefined
          this.activeDecade = Helpers.yearToDecade(this.activeYear!)
          this.activeYear = undefined
          this.activeMonth = undefined

          this.activeDepth = upDepth
          dispatchEvent(this, 'panel-change', {
            detail: { activeDepth: this.activeDepth },
          })
        }
        break
      }
      // 年代 -> 世纪
      case Depth.Decade: {
        const upDepth = Helpers.normalizeActiveDepth(Depth.Century, this.minDepth, this.depth)
        if (this.activeDepth !== upDepth) {
          this.activeCentury = Helpers.decadeToCentury(this.activeDecade!)
          this.activeDecade = undefined
          this.activeYear = undefined
          this.activeMonth = undefined

          this.activeDepth = upDepth
          dispatchEvent(this, 'panel-change', {
            detail: { activeDepth: this.activeDepth },
          })
        }
        break
      }
    }
  }

  // 仅限 year、month、date 三种 item
  #leafModelToDate(itemModel: MaybeLeafModel) {
    return Helpers.makeDate(itemModel.year, itemModel.month || 0, itemModel.date || 1)
  }

  #dateToModel(dateObj: Date): ItemModel {
    return Helpers.dateToModel(dateObj, this.activeDepth)
  }

  // 展示 model 所在视图
  showItemModel(itemModel: ItemModel) {
    if (Helpers.isDayModel(itemModel)) {
      this.activeDepth = Helpers.normalizeActiveDepth(Depth.Month, this.minDepth, this.depth)
      this.activeCentury = itemModel.century
      this.activeDecade = itemModel.decade
      this.activeYear = itemModel.year
      this.activeMonth = itemModel.month
    } else if (Helpers.isMonthModel(itemModel)) {
      this.activeDepth = Helpers.normalizeActiveDepth(Depth.Year, this.minDepth, this.depth)
      this.activeCentury = itemModel.century
      this.activeDecade = itemModel.decade
      this.activeYear = itemModel.year
      this.activeMonth = itemModel.month
    } else if (Helpers.isYearModel(itemModel)) {
      this.activeDepth = Helpers.normalizeActiveDepth(Depth.Decade, this.minDepth, this.depth)
      this.activeCentury = itemModel.century
      this.activeDecade = itemModel.decade
      this.activeYear = itemModel.year
      this.activeMonth = itemModel.month
    } else if (Helpers.isDecadeModel(itemModel)) {
      this.activeDepth = Helpers.normalizeActiveDepth(Depth.Century, this.minDepth, this.depth)
      this.activeCentury = itemModel.century
      this.activeDecade = itemModel.decade
      this.activeYear = itemModel.year
      this.activeMonth = itemModel.month
    }
  }

  // 显示日期值所在的视图（最深）
  showValue(dateObj: Date) {
    this.activeDepth = this.depth
    switch (this.depth) {
      case Depth.Month: {
        this.activeCentury = undefined
        this.activeDecade = undefined
        this.activeYear = dateObj.getFullYear()
        this.activeMonth = dateObj.getMonth()
        break
      }
      case Depth.Year: {
        this.activeCentury = undefined
        this.activeDecade = undefined
        this.activeYear = dateObj.getFullYear()
        this.activeMonth = undefined
        break
      }
      case Depth.Decade: {
        this.activeCentury = undefined
        this.activeDecade = Helpers.yearToDecade(dateObj.getFullYear())
        this.activeYear = undefined
        this.activeMonth = undefined
        break
      }
    }
  }

  // 显示上个月的选项
  showPrevMonth() {
    if (this.activeMonth == null) return
    if (this.activeMonth > 0) {
      this.activeMonth--
    } else {
      if (this.activeYear) {
        this.activeYear--
      }
      this.activeMonth = 11
    }
    dispatchEvent(this, 'prev-month', {
      detail: {
        century: this.activeCentury,
        decade: this.activeDecade,
        year: this.activeYear,
        month: this.activeMonth,
      },
    })
  }

  // 显示下个月的选项
  showNextMonth() {
    if (this.activeMonth == null) return
    if (this.activeMonth < 11) {
      this.activeMonth++
    } else {
      if (this.activeYear) {
        this.activeYear++
      }
      this.activeMonth = 0
    }
    dispatchEvent(this, 'next-month', {
      detail: {
        century: this.activeCentury,
        decade: this.activeDecade,
        year: this.activeYear,
        month: this.activeMonth,
      },
    })
  }

  // 显示上一年的选项
  showPrevYear() {
    if (typeof this.activeYear === 'number') {
      this.activeYear--
      dispatchEvent(this, 'prev-year', {
        detail: {
          century: this.activeCentury,
          decade: this.activeDecade,
          year: this.activeYear,
        },
      })
    }
  }

  // 显示下一年的选项
  showNextYear() {
    if (typeof this.activeYear === 'number') {
      this.activeYear++
      dispatchEvent(this, 'next-year', {
        detail: {
          century: this.activeCentury,
          decade: this.activeDecade,
          year: this.activeYear,
        },
      })
    }
  }

  // 显示上个年代（十年）的选项
  showPrevDecade() {
    if (typeof this.activeDecade === 'number') {
      this.activeDecade--
      dispatchEvent(this, 'prev-decade', {
        detail: { century: this.activeCentury, decade: this.activeDecade },
      })
    }
  }

  // 显示下个年代（十年）的选项
  showNextDecade() {
    if (typeof this.activeDecade === 'number') {
      this.activeDecade++
      dispatchEvent(this, 'next-decade', {
        detail: { century: this.activeCentury, decade: this.activeDecade },
      })
    }
  }

  // 显示上一个世纪的选项
  showPrevCentury() {
    if (typeof this.activeCentury === 'number') {
      this.activeCentury--
      dispatchEvent(this, 'prev-century', {
        detail: { century: this.activeCentury },
      })
    }
  }

  // 显示下一个世纪的选项
  showNextCentury() {
    if (typeof this.activeCentury === 'number') {
      this.activeCentury++
      dispatchEvent(this, 'next-century', {
        detail: { century: this.activeCentury },
      })
    }
  }

  // 检测两个日期是否同一天
  // 可以根据需要覆盖该实现，默认实现为精确到天即可（时分秒不关心）
  dateEquals(a: Date, b: Date): boolean {
    if (a === b) return true
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  // 获取当前选项对应的 badge
  getBadges(item: ItemModel) {
    let badges: Badge[]
    if (this.activeDepth === Depth.Month) {
      badges = this.badges.filter(b => item.date === b.date && item.month === b.month && b.year === item.year)
    } else if (this.activeDepth === Depth.Year) {
      badges = this.badges.filter(b => item.month === b.month && b.year === item.year)
    } else if (this.activeDepth === Depth.Decade) {
      badges = this.badges.filter(b => b.year === item.year)
    } else if (this.activeDepth === Depth.Century) {
      badges = this.badges.filter(b => b.year >= item.decade * 10 && b.year <= item.decade * 10 + 9)
    } else {
      badges = []
    }
    return badges
  }
}
