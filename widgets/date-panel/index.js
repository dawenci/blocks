import {
  $radiusBase,
  $colorPrimary,
  $colorWarn,
  $transitionDuration,
} from '../theme/var.js'

import { Depth } from './data.js'
import { normalizeDepth, normalizeMinDepth, normalizeViewDepth, toggleClass, toggleAttr, range, getClosestDate, getFirstDate, getLastDate, getLastDateOfPrevMonth, getFirstDateOfNextMonth } from './helpers.js'

const TEMPLATE_CSS = `<style>
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:host, :host * {
  box-sizing: border-box;
}
:host(:focus) {
  outline: 0 none;
}

:host {
  display: inline-block;
  user-select: none;
  background-color: #fff;
  cursor: default;
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
}
.container:focus {
  outline: 0 none;
}

.header {
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  width: 220px;
  height: 28px;
  line-height: 28px;
  cursor: default;
}

.button {
  flex: 0 0 28px;
  overflow: hidden;
  display: block;
  position: relative;
  width: 28px;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0 none;
  background-color: transparent;
  text-align: center;
  font-size: 0;
  outline: 0;
}

.button::before,
.button::after {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  content: '';
  width: 6px;
  height: 6px;
  transform: rotate(45deg);
  border-width: 0;
  border-style: solid;
  border-color: #666;
}

.button:hover::before,
.button:hover::after,
.button:active::before,
.button:active::after,
.button:focus::before,
.button:focus::after {
  border-color: ${$colorPrimary};
}

.button.button-prevPrev::before,
.button.button-prevPrev::after {
  border-bottom-width: 1px;
  border-left-width: 1px;
}
.button.button-prevPrev::after {
  left: 8px;
}

.button.button-prev::before {
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.button.button-next::before {
  border-top-width: 1px;
  border-right-width: 1px;
}

.button.button-nextNext::before,
.button.button-nextNext::after {
  border-top-width: 1px;
  border-right-width: 1px;
}
.button.button-nextNext::after {
  right: 8px;
}
 
.header-content {
  flex: 1 1 100%;
  height: 28px;
  text-align: center;
  font-size: 12px;
}

.header-title {
  overflow: hidden;
  width: 100%;
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  margin: 5px auto;
  border: 0 none;
  border-radius: 3px;
  background: transparent;
}
.header-title:focus {
  outline: 0 none;
  background-color: #f0f0f0;
  color: ${$colorPrimary};
}
.header-title:hover {
  color: ${$colorPrimary};
}

.body {
  position: relative;
  width: 220px;
}

.week-header {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  height: 30px;
  padding: 0 5px;
  box-shadow: inset 0 -1px 1px #f0f0f0;
  line-height: 29px;
  font-size: 12px;
  text-align: center;
  transition: ${$transitionDuration} all;
}

.week-header span {
  display: block;
  width: 30px;
  height: 20px;
}

.button-list {
  overflow: hidden;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 220px;
  padding: 5px;
  transition: ${$transitionDuration} all;
}

.body-month .button-list {
  height: 190px;
}

.body-year .button-list,
.body-decade .button-list {
  height: 220px;
}

.button-item {
  position: relative;
  margin: 1px;
  padding: 0;
  text-align: center;
  border: 0 none;
  background: transparent;
  border-radius: ${$radiusBase};
  font-size: 12px;
  transition: ${$transitionDuration} height,
    ${$transitionDuration} background,
    ${$transitionDuration} color;
}
.button-item:focus {
  background-color: #f0f0f0;
  color: ${$colorPrimary};
  outline: 0 none;
}

/* 7 * 5 */
.body-month .button-item {
  width: 28px;
  height: 28px;
  line-height: 28px;  
}

/* 4 * 3 */
.body-year .button-item,
.body-decade .button-item {
  width: 50px;
  height: 68px;
  line-height: 68px;
}

.button-item.button-item--otherMonth,
.button-item[disabled] {
  color: #ccc;
}

.button-item:not([disabled]):hover {
  background-color: #f0f0f0;
}

.button-item.button-item--today {
  color: ${$colorPrimary};
  text-shadow: 0 0 1px ${$colorPrimary};
}

.button-item.button-item--childActive {
  color: ${$colorPrimary};
  text-shadow: 0 0 1px ${$colorPrimary};
}

.button-item.button-item--active,
.button-item.button-item--active:hover,
.button-item.button-item--active:active {
  background-color: ${$colorPrimary};
  color: #fff;
}

.button-badge {
  display: block;
  position: absolute;
  overflow: hidden;
  width: 6px;
  height: 6px;
  background: ${$colorWarn};
  border: 1px solid #fff;
  border-radius: 50%;
  top: 3px;
  right: 3px;
}

.body-loading {
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 220px;
  height: 180px;
  background-color: rgba(255,255,255,.7);
}

.body-loading .icon {
  overflow: hidden;
  position: absolute;
  top: -30px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 30px;
  margin: auto;
  border-radius: 50%;
  animation: 1s linear infinite rotate360;
}

.body-loading .icon i {
  overflow: hidden;
  position: relative;
  width: 13px;
  height: 100%;
}
.body-loading .icon i::before {
  position: absolute;
  margin: auto;
  content: '';
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0,0,0,.2);
  border-radius: 50%;
}

.body-loading .icon i:nth-child(1) {
  float: left;
}
.body-loading .icon i:nth-child(1)::before {
  top: 0;
  right: auto;
  bottom: 0;
  left: 0;
}

.body-loading .icon i:nth-child(2) {
  float: right;
}
.body-loading .icon i:nth-child(2)::before {
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
}
</style>`

const TEMPLATE_HTML = `
<div class="container" tabindex="-1">
  <header class="header">
    <button class="button button-prevPrev"></button>
    <button class="button button-prev"></button>
    <div class="header-content">
      <button class="header-title"></button>
    </div>
    <button class="button button-next"></button>
    <button class="button button-nextNext"></button>
  </header>

  <div class="body">
    <div class="week-header"></div>
    <div class="button-list"></div>

    <div class="body-loading">
      <div class="icon"><i></i><i></i></div>
    </div>
  </div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


class BlocksDatePanel extends HTMLElement {
  static get Depth() {
    return Depth
  }

  static get observedAttributes() {
    return [
      // 选择值的深度
      // month 代表最深按照月展示选项，可以选择到 “天”
      // year 代表最深按照年份展示选项，可以选择到 “月”
      // decade 代表最深按照十年展示选项，可以选择到 “年”
      'depth',
      // 可切换至的最小深度
      'mindepth',
      // 初始化显示的深度
      'startdepth',
      // model 值
      'value',
      // 校验（depth 末级）选项是否可用
      // (data: { year: number, month?: number, date?: number }) => boolean
      'disableMethod',
      // 是否多选模式
      'multiple',
      // 多选模式的话，最多能选择多少个值
      'max',
      // 是否使用 loading 遮罩
      'loading',
      // 每周从星期几开始，0 代表星期天，1 代表星期一，顺序类推
      'startWeekOn',
    ]
  }

  constructor() {
    super()

    this.attachShadow({
      mode: 'open',
      // 代理焦点，
      // 1. 点击 shadow DOM 内某个不可聚焦的区域，则第一个可聚焦区域将成为焦点
      // 2. 当 shadow DOM 内的节点获得焦点时，除了聚焦的元素外，:focus 还会应用到宿主
      // 3. 自己的 slot 中的元素聚焦，宿主不会获得焦点，但是 :focus-within 生效
      delegatesFocus: true
    })

    const fragment = template.content.cloneNode(true)
    this.shadowRoot.appendChild(fragment)

    const panel = this.shadowRoot.querySelector('.container')
    this.elements = {
      panel,
      title: panel.querySelector('.header-title'),
      prevPrev: panel.querySelector('.button-prevPrev'),
      prev: panel.querySelector('.button-prev'),
      nextNext: panel.querySelector('.button-nextNext'),
      next: panel.querySelector('.button-next'),
      weekHeader: panel.querySelector('.week-header'),
      content: panel.querySelector('.body'),
      list: panel.querySelector('.button-list'),
      loading: panel.querySelector('.body-loading')
    }

    // 当前组件面板对应的年
    this.year = (this.closestDate ?? new Date()).getFullYear()
    // 当前组件面板对应的月
    this.month = (this.closestDate ?? new Date()).getMonth()
    // 当前组件面板对应的年代（十年）
    this.decade = [+(String(this.year).slice(0, -1) + '0'), +(String(this.year).slice(0, -1) + '9')]
    // 面板视图深度层级
    this.viewDepth = this.startdepth
    
    panel.onclick = (e) => {
      const target = e.target
      if (this.elements.prevPrev.contains(target)) {
        this.onPrevPrev()
      }
      else if (this.elements.prev.contains(target)) {
        this.onPrev()
      }
      else if (this.elements.next.contains(target)) {
        this.onNext()
      }
      else if (this.elements.nextNext.contains(target)) {
        this.onNextNext()
      }
      else if (this.elements.title.contains(target)) {
        this.onSwitchDepth()
      }
      else if (target.classList.contains('button-item')) {
        this.onClickItem({
          label: target.dataset.label,
          year: +target.dataset.year,
          month: +target.dataset.month,
          date: +target.dataset.date,
        })
      }
      this.focus()
    }
  }

  renderTitle() {
    this.elements.title.textContent = this.title
  }

  renderWeekHeader() {
    const header = this.elements.weekHeader
    if (this.viewDepth === Depth.Month) {
      // header.style.display = ''
      header.style.height = ''
      header.style.opacity = '1'

      if (header.children.length !== 7) {
        header.innerHTML = this.weekHeaders.map(header => `<span>${header}</span>`).join('')
      }
      else {
        for (let i = 0; i < 7; i += 1) {
          header.children[i].textContent = this.weekHeaders[i]
        }
      }
    }
    else {
      header.style.height = '0'
      header.style.opacity = '0'
    }
  }

  renderLoading() {
    this.elements.loading.style.display = this.loading ? '' : 'none'
  }

  renderItems() {
    ;['body-decade', 'body-year', 'body-month'].forEach(klass => {
      this.elements.content.classList.remove(klass)
    })
    const contentPanelClass = `body-${this.viewDepth}`
    this.elements.content.classList.add(contentPanelClass)

    if (this.viewDepth === Depth.Month) {
      this.renderDateItems()
    }
    else if (this.viewDepth === Depth.Year) {
      this.renderMonthItems()
    }
    else if (this.viewDepth === Depth.Decade) {
      this.renderYearItems()
    }
  }

  // 只保留 N 个日期按钮
  ensureItemCount(n) {
    const list = this.elements.list
    let len = list.children.length ?? 0
    while (len++ < n) {
      const el = document.createElement('button')
      el.className = 'button-item'
      list.appendChild(el)
    }
    len = list.children.length
    while (len-- > n) {
      list.removeChild(list.lastElementChild)
    }
    return Array.prototype.slice.call(list.children)
  }

  renderBadge(el, item) {
    const badges = this.getBadges(item)
    let badgeEl = el.querySelector('.button-badge')
    if (badges === null) {
      el.title = ''
      if (badgeEl) el.removeChild(badgeEl)
      return
    }
    if (!badgeEl) badgeEl = el.appendChild(document.createElement('i'))
    badgeEl.classList.add('button-badge')
    let title = badges.filter(badge => badge.label).map(badge => badge.label).join('\n')
    if (title.length > 100) title = title.slice(0, 97) + '...'
    el.title = title
  }

  renderYearItems() {
    if (!this.yearList.length) return
    this.ensureItemCount(10).forEach((el, i) => {
      const item = this.yearList[i]
      toggleClass(el, 'button-item--otherMonth', false)
      toggleClass(el, 'button-item--today', false)
      toggleClass(el, 'button-item--active', false)
      toggleClass(el, 'button-item--childActive', this.isChildActive(item))
      toggleAttr(el, 'disabled', false)
      el.dataset.year = item.year
      el.dataset.month = null
      el.dataset.date = null
      el.dataset.label = item.label
      el.innerHTML = item.label
      this.renderBadge(el, item)
    })
  }

  renderMonthItems() {
    if (!this.monthList.length) return
    this.ensureItemCount(12).forEach((el, i) => {
      const item = this.monthList[i]
      toggleClass(el, 'button-item--otherMonth', false)
      toggleClass(el, 'button-item--today', false)
      toggleClass(el, 'button-item--active', false)
      toggleClass(el, 'button-item--childActive', this.isChildActive(item))
      toggleAttr(el, 'disabled', false)
      el.dataset.year = item.year
      el.dataset.month = item.month
      el.dataset.date = null
      el.dataset.label = item.label
      el.innerHTML = item.label
      this.renderBadge(el, item)
    })
  }

  renderDateItems() {
    if (!this.dateList.length) return
    this.ensureItemCount(42).forEach((el, i) => {
      const item = this.dateList[i]
      toggleClass(el, 'button-item--otherMonth', !this.isCurrentMonth(item))
      toggleClass(el, 'button-item--today', this.isToday(item))
      toggleClass(el, 'button-item--active', this.isActive(item))
      toggleClass(el, 'button-item--childActive', false)
      toggleAttr(el, 'disabled', !this.isActive(item) && this.isDisabled(item))
      el.dataset.year = item.year
      el.dataset.month = item.month
      el.dataset.date = item.date
      el.dataset.label = item.label
      el.innerHTML = item.label
      this.renderBadge(el, item)
    })
  }

  render() {
    this.renderTitle()
    this.renderWeekHeader()
    this.renderLoading()
    this.renderItems()
  }  

  get value() {
    return this._value
  }

  set value(value) {
    if (this.multiple && Array.isArray(value)) {
      this._value = value
      this.render()
      this.dispatchEvent(new CustomEvent('input', { detail: { value } }))
    }
    else if (value instanceof Date) {
      this._value = value
      this.render()
      this.dispatchEvent(new CustomEvent('input', { detail: { value } }))
    }
  }

  get depth() {
    return normalizeDepth(this.getAttribute('depth'))
  }

  set depth(value) {
    this.setAttribute('depth', normalizeDepth(value))
  }

  get mindepth() {
    return normalizeMinDepth(this.getAttribute('mindepth'), this.depth)
  }

  set mindepth(value) {
    this.setAttribute('mindepth', normalizeMinDepth(value, this.depth))
  }

  get startdepth() {
    return normalizeViewDepth(this.getAttribute('startdepth'), this.mindepth, this.depth)
  }

  set startdepth(value) {
    this.setAttribute('startdepth', normalizeViewDepth(value, this.mindepth, this.depth))
  }

  get viewDepth() {
    return normalizeViewDepth(this._viewDepth, this.mindepth, this.depth)
  }

  set viewDepth(value) {
    if (this._viewDepth === value) return
    this._viewDepth = normalizeViewDepth(value, this.mindepth, this.depth)
    this.render()
  }

  get max() {
    return parseInt(this.getAttribute('max'), 10) || null
  }

  set max(value) {
    if (typeof value !== 'number' || value !== value) return
    this.setAttribute('max', Math.trunc(value))
  }

  get multiple() {
    return this.hasAttribute('multiple')
  }

  set multiple(value) {
    if (value === null || value === false) {
      this.removeAttribute('multiple')
    }
    else {
      this.setAttribute('multiple', '')
    }
  }

  get year() {
    return this._year
  }

  set year(value) {
    if (this._year === value) return
    this._year = value
    this.render()
  }

  get month() {
    return this._month
  }

  set month(value) {
    if (this._month === value) return
    this._month = value
    this.render()
  }

  get decade() {
    return this._decade ?? [+(String(this.year).slice(0, -1) + '0'), +(String(this.year).slice(0, -1) + '9')]
  }

  set decade(value) {
    this._decade = value
    this.render()
  }

  get badges() {
    return this._badges ?? []
  }

  /**
   * @param {Array<{year: number, month?: number, date?: number, label?: string}>} value
   */
  set badges(value) {
    this._badges = value
    this.render()
  }

  get today() {
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate()
    }
  }

  get title() {
    if (this.viewDepth === 'decade') {
      return `${this.decade[0]}-${this.decade[1]}`
    }
    if (this.viewDepth === 'year') {
      return `${this.year}`
    }
    return `${this.year}-${this.month + 1}`
  }

  // 是否已经选够最大数量的值
  get limitReached() {
    if (!this.multiple || !this.max) return false
    let max = Math.trunc(this.max)
    if (max < 1) max = 1
    const len = this.value?.length ?? 0
    return len >= max
  }

  // 在一组日期中，获取距离当前时刻最接近的那一个日期
  get closestDate() {
    return getClosestDate(this.getValues())
  }

  get startWeekOn() {
    return this.getAttribute('startweekon') ?? 1
  }

  set startWeekOn(value) {
    this.setAttribute('startweekon', value % 7)
  }

  get weekHeaders() {
    const headers = ['日', '一', '二', '三', '四', '五', '六']
    return headers.slice(this.startWeekOn).concat(headers.slice(0, this.startWeekOn))
  }

  // 日期列表（按月动态生成）
  get dateList() {
    if (this.year == null || this.month == null) return []

    // 该月的第一天
    const firstDate = getFirstDate(this.year, this.month)
    // 该月的最后一天
    const lastDate = getLastDate(this.year, this.month)
    // 该月的所有日
    const dateRange = range(1, lastDate.getDate())
      .map(date => ({ label: date, year: this.year, month: this.month, date }))

    // 该月第一天在星期中的序号，如果不是从配置的 startWeekOn 开始，则在前面补上个月的日期
    const firstDateIndex = firstDate.getDay()
    if (firstDateIndex !== this.startWeekOn) {
      // 上个月最后一天
      const prevLastDate = getLastDateOfPrevMonth(this.year, this.month)
      const prevYear = prevLastDate.getFullYear()
      const prevMonth = prevLastDate.getMonth()
      let date = prevLastDate.getDate()
      // 需要补的天数
      let n = (7 + firstDateIndex - this.startWeekOn) % 7
      while (n--) {
        dateRange.unshift({
          label: date,
          year: prevYear,
          month: prevMonth,
          date: date
        })
        date--
      }
    }

    // 2. 末尾用下个月的日期填满，总共是 6 * 7 = 42 天
    // 下个月第一天
    const nextFirstDate = getFirstDateOfNextMonth(this.year, this.month)
    const nextYear = nextFirstDate.getFullYear()
    const nextMonth = nextFirstDate.getMonth()
    let date = nextFirstDate.getDate()
    while (dateRange.length < 42) {
      dateRange.push({
        label: date,
        year: nextYear,
        month: nextMonth,
        date: date,
      })
      date++
    }

    return dateRange
  }

  // 月份列表（固定 1 - 12 月）
  get monthList() {
    return range(0, 11).map(month => ({ label: month + 1, year: this.year, month }))
  }

  // 年份列表（10 年一组）
  get yearList() {
    return range(...this.decade).map(year => ({ label: year, year }))
  }

  // 选项列表
  get optionList() {
    if (this.viewDepth === 'decade') return this.yearList
    if (this.viewDepth === 'year') return this.monthList
    return this.dateList
  }

  // 是否当前面板对应的月
  isCurrentMonth(item) {
    return item.month === this.month
  }

  // 当前选项是否是今天
  isToday(item) {
    return item.year === this.today.year && item.month === this.today.month && item.date === this.today.date
  }

  // 获取当前选项对应的 badge
  getBadges(item) {
    let badges
    if (this.viewDepth === Depth.Month) {
      badges = this.badges.filter(t => item.date === t.date && item.month === t.month && t.year === item.year)
    }
    if (this.viewDepth === Depth.Year) {
      badges = this.badges.filter(t => item.month === t.month && t.year === item.year)
    }
    if (this.viewDepth === Depth.Decade) {
      badges = this.badges.filter(t => t.year === item.year)
    }
    if (!badges.length) return null
    return badges
  }

  // 当前选项是否选中
  isActive(item) {
    const isActive = this.depth === 'month'
      ? t => t.getFullYear() === item.year && t.getMonth() === item.month && t.getDate() === item.date
      : this.depth === 'year'
        ? t => t.getFullYear() === item.year && t.getMonth() === item.month
        : this.depth === 'decade'
          ? t => t.getFullYear() === item.year
          : () => false

    return this.getValues().some(isActive)
  }

  // 是否有子结点选中（年下的月、日，月下的日等等）
  isChildActive(item) {
    if (this.viewDepth === Depth.Month) return false
    if (this.viewDepth === Depth.Year) {
      return this.getValues().some(t => t.getMonth() === item.month && t.getFullYear() === item.year)
    }
    if (this.viewDepth === Depth.Decade) {
      return this.getValues().some(t => t.getFullYear() === item.year)
    }
    return false
  }

  // 获取当前选中的值数组（非多选也转换成数组）
  getValues() {
    return this.multiple ? (this.value ?? []).slice() : this.value ? [this.value] : []
  }

  // 当前选项是否渲染成禁用，仅作用于末级 depth
  isDisabled(item) {
    if (this.viewDepth !== this.depth) return false
    // 检查是否抵达数量上限，
    if (this.limitReached) return true
    // 通过外部传入的 disableMethod 检查
    return this.disableMethod ?
      this.disableMethod({
        year: item.year,
        month: item.month,
        date: item.date,
      })
      : false
  }

  // 点击选项时的 handler
  onClickItem(item) {
    // 点击 disabled 的日期，且该日期非激活状态，则直接返回
    // 如果该日期为激活状态，则可以取消选择（多选时）
    if (this.isDisabled(item) && !this.isActive(item)) {
      return
    }

    // 月视图是最深的层次了，当前操作是选择天
    if (this.viewDepth === Depth.Month) {
      return this.selectDate(item)
    }
    // 当前是年视图，并且组件设置年视图是最深层次，则当前操作是选择月
    if (this.viewDepth === Depth.Year && this.depth === Depth.Year) {
      return this.selectMonth(item)
    }
    // 当前是年代视图，并且组件设置了年代视图是最深层次，则当前操作是选择年
    if (this.viewDepth === Depth.Decade && this.depth === Depth.Decade) {
      return this.selectYear(item)
    }

    // 当前非处于最深的视图层次，则往下钻入下一级视图（年代->年，或年->月）
    if (this.viewDepth === Depth.Year) {
      this.month = item.month
      this.viewDepth = Depth.Month
      this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
      return
    }
    this.viewDepth = Depth.Year
    this.year = item.year
    this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
  }

  // 通知外部 v-model 更新
  changeValue(value) {
    if (Array.isArray(value) && this.max) {
      if (value.length > this.max) {
        console.error('选择的日期值超过最大数量限制')
        return
      }
    }
    this.value = value
  }

  // 选择、添加某一天作为值
  selectDate(item) {
    if (this.multiple) {
      const values = this.getValues()
      if (this.isActive(item)) {
        const index = values.findIndex(t => t.getDate() === item.date && t.getMonth() === item.month && t.getFullYear() === item.year)
        if (index !== -1) values.splice(index, 1)
      }
      else {
        values.push(new Date(item.year, item.month, item.date))
      }
      this.changeValue(values)
    }
    else {
      if (this.isActive(item)) return
      this.changeValue(new Date(item.year, item.month, item.date))
    }
  }

  // 选择、添加某一月作为值
  selectMonth(item) {
    if (this.multiple) {
      const values = this.getValues()
      if (this.isActive(item)) {
        const index = values.findIndex(t => t.getMonth() === item.month && t.getFullYear() === item.year)
        if (index !== -1) values.splice(index, 1)
      }
      else {
        values.push(new Date(item.year, item.month, 1))
      }
      this.changeValue(values)
    }
    else {
      if (this.isActive(item)) return
      this.changeValue(new Date(item.year, item.month, 1))
    }
  }

  // 选择、添加某一年作为值
  selectYear(item) {
    if (this.multiple) {
      const values = this.getValues()
      if (this.isActive(item)) {
        const index = values.findIndex(t => t.getFullYear() === item.year)
        if (index !== -1) values.splice(index, 1)
      }
      else {
        values.push(new Date(item.year, 0, 1))
      }
      this.changeValue(values)
    }
    else {
      if (this.isActive(item)) return
      this.changeValue(new Date(item.year, 0, 1))
    }
  }

  // 显示上个月的选项
  showPrevMonth() {
    if (this.month > 0) {
      this.month--
    }
    else {
      this.year--
      this.month = 11
    }
    this.dispatchEvent(new CustomEvent('prev-month', { detail: { year: this.year, month: this.month } }))
  }

  // 显示下个月的选项
  showNextMonth() {
    if (this.month < 11) {
      this.month++
    }
    else {
      this.year++
      this.month = 0
    }
    this.dispatchEvent(new CustomEvent('next-month', { detail: { year: this.year, month: this.month } }))
  }

  // 显示上一年的选项
  showPrevYear() {
    this.year--
    this.dispatchEvent(new CustomEvent('prev-year', { detail: { year: this.year, month: this.month } }))
  }

  // 显示下一年的选项
  showNextYear() {
    this.year++
    this.dispatchEvent(new CustomEvent('next-year', { detail: { year: this.year, month: this.month } }))
  }

  // 显示上个年代（十年）的选项
  showPrevDecade() {
    this.decade = this.decade.map(n => n - 10)
    this.dispatchEvent(new CustomEvent('prev-decade', { detail: { year: this.year, month: this.month } }))
  }

  // 显示下个年代（十年）的选项
  showNextDecade() {
    this.decade = this.decade.map(n => n + 10)
    this.dispatchEvent(new CustomEvent('next-decade', { detail: { year: this.year, month: this.month } }))
  }

  // 点击 prev 按钮
  onPrev() {
    if (this.viewDepth === 'month') {
      this.showPrevMonth()
    }
    else if (this.viewDepth === 'year') {
      this.showPrevYear()
    }
    else {
      this.showPrevDecade()
    }
  }

  // 点击双重 prev 按钮
  onPrevPrev() {
    if (this.viewDepth === 'month') {
      this.showPrevYear()
    }
  }

  // 点击 next 按钮
  onNext() {
    if (this.viewDepth === 'month') {
      this.showNextMonth()
    }
    else if (this.viewDepth === 'year') {
      this.showNextYear()
    }
    else {
      this.showNextDecade()
    }
  }

  // 点击双重 next 按钮
  onNextNext() {
    if (this.viewDepth === 'month') {
      this.showNextYear()
    }
  }

  // 点击 title，切换到上级视图（月 -> 年，年 -> 十年）
  onSwitchDepth() {
    switch (this.viewDepth) {
      case 'month': {
        this.viewDepth = normalizeViewDepth(Depth.Year, this.mindepth, this.depth)
        this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
        break
      }
      case 'year': {
        this.viewDepth = normalizeViewDepth(Depth.Decade, this.mindepth, this.depth)
        this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
        break
      }
    }
  }
 
  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      this._upgradeProperty(attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  // adoptedCallback() {
  // }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }

  _focus() {
    if (this.restorefocus && !this._prevFocus) {
      this._prevFocus = document.activeElement
    }
    this.popup.focus()
  }

  _blur() {
    this.popup.blur()
    if (this._prevFocus) {
      if (this.restorefocus && typeof this._prevFocus.focus) {
        this._prevFocus.focus()
      }
      this._prevFocus = undefined
    }
  }

  _getBool(attrName) {
    return this.hasAttribute(attrName)
  }

  _setBool(attrName, value) {
    if (value === null || value === false) {
      this.removeAttribute(attrName)
    } else {
      this.setAttribute(attrName, '')
    }
  }

  // 启用鼠标交互
  _enableEvents() {
    this.popup.style.pointerEvents = ''
  }

  // 禁用鼠标交互
  _disableEvents() {
    this.popup.style.pointerEvents = 'none'
  }

  // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
  // 属性可能在 prototype 还没有链接到该实例前就设置了，
  // 在用户使用一些框架加载组件时，可能回出现这种情况，
  // 因此需要进行属性升级，确保 setter 逻辑能工作，
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop]
      delete this[prop]
      this[prop] = value
    }
  }
}

if (!customElements.get('blocks-date-panel')) {
  customElements.define('blocks-date-panel', BlocksDatePanel)
}
