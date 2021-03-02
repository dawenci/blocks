import { upgradeProperty } from '../../common/upgradeProperty.js'
import {
  __radius_base,
  __color_primary,
  __color_warning,
  __transition_duration,
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

:host {
  display: inline-block;
  box-sizing: border-box;
  user-select: none;
  background-color: #fff;
  cursor: default;
}
:host(:focus) {
  outline: 0 none;
}

#layout {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
}
#layout:focus {
  outline: 0 none;
}

#header {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  width: 220px;
  height: 28px;
  line-height: 28px;
  cursor: default;
}

.header-button {
  flex: 0 0 28px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: block;
  width: 28px;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0 none;
  background-color: transparent;
  text-align: center;
  font-size: 0;
  outline: 0;
  transition: var(--transition-duration, ${__transition_duration}) all;
}

.header-button::before,
.header-button::after {
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

.header-button:hover::before,
.header-button:hover::after,
.header-button:active::before,
.header-button:active::after,
.header-button:focus::before,
.header-button:focus::after {
  border-color: var(--color-primary, ${__color_primary});
}

.header-button.button-prevPrev::before,
.header-button.button-prevPrev::after {
  border-bottom-width: 1px;
  border-left-width: 1px;
}
.header-button.button-prevPrev::after {
  left: 8px;
}

.header-button.button-prev::before {
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.header-button.button-next::before {
  border-top-width: 1px;
  border-right-width: 1px;
}

.header-button.button-nextNext::before,
.header-button.button-nextNext::after {
  border-top-width: 1px;
  border-right-width: 1px;
}
.header-button.button-nextNext::after {
  right: 8px;
}
 
.header-content {
  box-sizing: border-box;
  flex: 1 1 100%;
  height: 28px;
  text-align: center;
  font-size: 12px;
}

.header-title {
  box-sizing: border-box;
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
  color: var(--color-primary, ${__color_primary});
}
.header-title:hover {
  color: var(--color-primary, ${__color_primary});
}

#body {
  box-sizing: border-box;
  position: relative;
  width: 220px;
}

.week-header {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  height: 30px;
  padding: 0 5px;
  box-shadow: inset 0 -1px 1px #f0f0f0;
  line-height: 29px;
  font-size: 12px;
  text-align: center;
  transition: var(--transition-duration, ${__transition_duration}) all;
}

.week-header span {
  box-sizing: border-box;
  display: block;
  width: 30px;
  height: 20px;
}

.button-list {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 220px;
  padding: 5px;
  transition: var(--transition-duration, ${__transition_duration}) all;
}

.body-month .button-list {
  height: 190px;
}

.body-year .button-list,
.body-decade .button-list,
.body-century .button-list {
  height: 220px;
}

.button-item {
  box-sizing: border-box;
  position: relative;
  margin: 1px;
  padding: 0;
  text-align: center;
  border: 0 none;
  background: transparent;
  border-radius: var(--radius-base, ${__radius_base});
  font-size: 12px;
  transition: var(--transition-duration, ${__transition_duration}) height,
    var(--transition-duration, ${__transition_duration}) background,
    var(--transition-duration, ${__transition_duration}) color;
}
.button-item:focus {
  background-color: #f0f0f0;
  color: var(--color-primary, ${__color_primary});
  outline: 0 none;
}

/* 7 col * 5 row */
.body-month .button-item {
  width: 28px;
  height: 28px;
  line-height: 28px;  
}

/* 3 col * 4 row */
.body-year .button-item {
  width: 68px;
  height: 50px;
  line-height: 50px;
}

/* 2 col * 5 row */
.body-century .button-item,
.body-decade .button-item {
  width: 103px;
  height: 40px;
  line-height: 40px;
}


.button-item.button-item--otherMonth,
.button-item[disabled] {
  color: #ccc;
}

.button-item:not([disabled]):hover {
  background-color: #f0f0f0;
}

.button-item.button-item--today {
  color: var(--color-primary, ${__color_primary});
  text-shadow: 0 0 1px var(--color-primary, ${__color_primary});
}

.button-item.button-item--childActive {
  color: var(--color-primary, ${__color_primary});
  text-shadow: 0 0 1px var(--color-primary, ${__color_primary});
}

.button-item.button-item--active,
.button-item.button-item--active:hover,
.button-item.button-item--active:active {
  background-color: var(--color-primary, ${__color_primary});
  color: #fff;
}

.button-badge {
  box-sizing: border-box;
  display: block;
  position: absolute;
  overflow: hidden;
  width: 6px;
  height: 6px;
  background: var(--color-warning, ${__color_warning});
  border: 1px solid #fff;
  border-radius: 50%;
  top: 3px;
  right: 3px;
}

.body-loading {
  box-sizing: border-box;
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
  box-sizing: border-box;
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
<div id="layout" tabindex="-1">
  <header id="header">
    <button class="header-button button-prevPrev"></button>
    <button class="header-button button-prev"></button>
    <div class="header-content">
      <button class="header-title"></button>
    </div>
    <button class="header-button button-next"></button>
    <button class="header-button button-nextNext"></button>
  </header>

  <div id="body">
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
      // 选择模式，支持 single, multiple, range
      'mode',
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

    const $panel = this.shadowRoot.querySelector('#layout')
    this.$panel = $panel
    this.$title = $panel.querySelector('.header-title')
    this.$prevPrev = $panel.querySelector('.button-prevPrev')
    this.$prev = $panel.querySelector('.button-prev')
    this.$nextNext = $panel.querySelector('.button-nextNext')
    this.$next = $panel.querySelector('.button-next')
    this.$weekHeader = $panel.querySelector('.week-header')
    this.$content = $panel.querySelector('#body')
    this.$list = $panel.querySelector('.button-list')
    this.$loading = $panel.querySelector('.body-loading')

    // 面板视图深度层级
    this.viewDepth = this.startdepth

    // 设置面板起始视图状态
    this.setPanelDate(this.closestDate ?? new Date())
    
    $panel.onclick = (e) => {
      const target = e.target
      if (this.$prevPrev.contains(target)) {
        this.onPrevPrev()
      }
      else if (this.$prev.contains(target)) {
        this.onPrev()
      }
      else if (this.$next.contains(target)) {
        this.onNext()
      }
      else if (this.$nextNext.contains(target)) {
        this.onNextNext()
      }
      else if (this.$title.contains(target)) {
        this.onSwitchDepth()
      }
      else if (target.classList.contains('button-item')) {
        this.onClickItem({
          label: target.dataset.label,
          century: +target.dataset.century,
          decade: +target.dataset.decade,
          year: +target.dataset.year,
          month: +target.dataset.month,
          date: +target.dataset.date,
        })
      }
      this.focus()
    }
  }

  setPanelDate(date) {
    const panelYear = date.getFullYear()
    this.panelCentury = Math.floor(panelYear / 100)
    this.panelDecade = [Depth.Century].includes(this.viewDepth) ? undefined : Math.floor(panelYear / 10)
    this.panelYear = [Depth.Century, Depth.Decade].includes(this.viewDepth) ? undefined : panelYear
    this.panelMonth = [Depth.Century, Depth.Decade, Depth.Year].includes(this.viewDepth) ? undefined : date.getMonth()
  }

  renderHeaderButtons() {
    if (this.viewDepth === Depth.Month) {
      this.$prevPrev.style.cssText = ''
      this.$nextNext.style.cssText = ''
    }
    else {
      this.$prevPrev.style.cssText = 'transfrom:scale(0,0);flex:0 0 0'
      this.$nextNext.style.cssText = 'transfrom:scale(0,0);flex:0 0 0'
    }
  }

  renderTitle() {
    this.$title.textContent = this.title
  }

  renderWeekHeader() {
    const header = this.$weekHeader
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
    this.$loading.style.display = this.loading ? '' : 'none'
  }

  renderItems() {
    ;['body-century', 'body-decade', 'body-year', 'body-month'].forEach(klass => {
      this.$content.classList.remove(klass)
    })
    const contentPanelClass = `body-${this.viewDepth}`
    this.$content.classList.add(contentPanelClass)

    if (this.viewDepth === Depth.Month) {
      this.renderDateItems()
    }
    else if (this.viewDepth === Depth.Year) {
      this.renderMonthItems()
    }
    else if (this.viewDepth === Depth.Decade) {
      this.renderYearItems()
    }
    else if (this.viewDepth === Depth.Century) {
      this.renderDecadeItems()
    }
  }

  // 只保留 N 个日期按钮
  ensureItemCount(n) {
    const list = this.$list
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

  renderDecadeItems() {
    if (!this.decadeList.length) return
    this.ensureItemCount(10).forEach((el, i) => {
      const item = this.decadeList[i]
      toggleClass(el, 'button-item--otherMonth', false)
      toggleClass(el, 'button-item--today', false)
      toggleClass(el, 'button-item--active', false)
      toggleClass(el, 'button-item--childActive', this.isChildActive(item))
      toggleAttr(el, 'disabled', false)
      el.dataset.century = item.century
      el.dataset.decade = item.decade
      el.dataset.year = null
      el.dataset.month = null
      el.dataset.date = null
      el.dataset.label = item.label
      el.innerHTML = item.label
      this.renderBadge(el, item)
    })
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
      el.dataset.century = item.century
      el.dataset.decade = item.decade
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
      el.dataset.century = item.century
      el.dataset.decade = item.decade
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
      el.dataset.century = item.century
      el.dataset.decade = item.decade
      el.dataset.year = item.year
      el.dataset.month = item.month
      el.dataset.date = item.date
      el.dataset.label = item.label
      el.innerHTML = item.label
      this.renderBadge(el, item)
    })
  }

  render() {
    this.renderHeaderButtons()
    this.renderTitle()
    this.renderWeekHeader()
    this.renderLoading()
    this.renderItems()
  }

  get panelCentury() {
    return this._panelCentury ?? Math.floor(this.panelYear / 100)
  }

  set panelCentury(value) {
    if (this._panelCentury === value) return
    this._panelCentury = value
    this.render()
  }

  get panelDecade() {
    return this._panelDecade ?? Math.floor(this.panelYear / 10)
  }

  set panelDecade(value) {
    if (this._panelDecade === value) return
    this._panelDecade = value
    this.render()
  }

  get panelYear() {
    return this._panelYear
  }

  set panelYear(value) {
    if (this._panelYear === value) return
    this._panelYear = value
    this.render()
  }

  get panelMonth() {
    return this._panelMonth
  }

  set panelMonth(value) {
    if (this._panelMonth === value) return
    this._panelMonth = value
    this.render()
  }

  get value() {
    return this._value
  }

  set value(value) {
    if (this.multiple) {
      if (!value) value = []
      if (this.max && value.length > this.max) {
        console.error('选择的日期值超过最大数量限制')
        return
      }
      this._value = value
      
    }
    else if (this.range) {
      if (!value) value = []
      value = value.slice()
      value.sort((a, b) => a.getTime() - b.getTime())
      this._value = value
    }
    else {
      this._value = value
    }

    this.render()
    this.dispatchEvent(new CustomEvent('input', { detail: { value } }))
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

  get mode() {
    const mode = this.getAttribute('mode')
    return ['single', 'multiple', 'range'].includes(mode) ? mode : 'single'
  }

  set mode(value) {
    value = ['single', 'multiple', 'range'].includes(value) ? value : 'single'
    if (value === 'single') {
      this.removeAttribute('mode')
    }
    else {
      this.setAttribute('mode', value)  
    }
  }

  get multiple() {
    return this.mode === 'multiple'
  }

  get range() {
    return this.mode === 'range'
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
    if (this.viewDepth === Depth.Century) {
      return `${this.panelCentury * 100} 至 ${this.panelCentury * 100 + 99}`
    }
    if (this.viewDepth === Depth.Decade) {
      const [from, to] = this.getDecadeRange(this.panelDecade)
      return `${from} 至 ${to}`
    }
    if (this.viewDepth === Depth.Year) {
      return `${this.panelYear} 年`
    }
    return `${this.panelYear} 年 ${this.panelMonth + 1} 月`
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
    if (this.panelYear == null || this.panelMonth == null) return []

    // 该月的第一天
    const firstDate = getFirstDate(this.panelYear, this.panelMonth)
    // 该月的最后一天
    const lastDate = getLastDate(this.panelYear, this.panelMonth)
    // 该月的所有日
    const dateRange = range(1, lastDate.getDate())
      .map(date => ({
        label: date,
        century: this.panelCentury,
        decade: this.panelDecade,
        year: this.panelYear,
        month: this.panelMonth,
        date
      }))

    // 该月第一天在星期中的序号，如果不是从配置的 startWeekOn 开始，则在前面补上个月的日期
    const firstDateIndex = firstDate.getDay()
    if (firstDateIndex !== this.startWeekOn) {
      // 上个月最后一天
      const prevLastDate = getLastDateOfPrevMonth(this.panelYear, this.panelMonth)
      const prevYear = prevLastDate.getFullYear()
      const prevMonth = prevLastDate.getMonth()
      let date = prevLastDate.getDate()
      // 需要补的天数
      let n = (7 + firstDateIndex - this.startWeekOn) % 7
      while (n--) {
        dateRange.unshift({
          label: date,
          century: Math.floor(prevYear / 100),
          decade: Math.floor(prevYear / 10),
          year: prevYear,
          month: prevMonth,
          date: date
        })
        date--
      }
    }

    // 2. 末尾用下个月的日期填满，总共是 6 * 7 = 42 天
    // 下个月第一天
    const nextFirstDate = getFirstDateOfNextMonth(this.panelYear, this.panelMonth)
    const nextYear = nextFirstDate.getFullYear()
    const nextMonth = nextFirstDate.getMonth()
    let date = nextFirstDate.getDate()
    while (dateRange.length < 42) {
      dateRange.push({
        label: date,
        century: Math.floor(nextYear / 100),
        decade: Math.floor(nextYear / 10),
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
    return range(0, 11).map(month => ({
      label: month + 1,
      century: this.panelCentury,
      decade: this.panelDecade,
      year: this.panelYear,
      month
    }))
  }

  // 年份列表（10 年一组）
  get yearList() {
    const [from, to] = this.getDecadeRange(this.panelDecade)
    return range(from, to).map(year => ({
      label: year,
      century: this.panelCentury,
      decade: this.panelDecade,
      year,
    }))
  }

  // 年代列表
  get decadeList() {
    const decadeFrom = this.panelCentury * 10
    const decadeTo = decadeFrom + 9
    const list = []
    for (let decade = decadeFrom; decade <= decadeTo; decade += 1) {
      list.push({
        label: `${decade * 10}-${decade * 10 + 9}`,
        century: this.panelCentury,
        decade
      })
    }
    return list
  }

  getDecadeRange(decade) {
    let from = decade * 10
    const to = from + 9
    return [from, to]
  }

  getCenturyRange(century) {
    let from = century * 100
    const to = from + 90
    return [from, to]
  }

  // 是否当前面板对应的月
  isCurrentMonth(item) {
    return item.month === this.panelMonth
  }

  // 当前选项是否是今天
  isToday(item) {
    return item.year === this.today.year && item.month === this.today.month && item.date === this.today.date
  }

  // 获取当前选项对应的 badge
  getBadges(item) {
    let badges
    if (this.viewDepth === Depth.Month) {
      badges = this.badges.filter(b => item.date === b.date && item.month === b.month && b.year === item.year)
    }
    if (this.viewDepth === Depth.Year) {
      badges = this.badges.filter(b => item.month === b.month && b.year === item.year)
    }
    if (this.viewDepth === Depth.Decade) {
      badges = this.badges.filter(b => b.year === item.year)
    }
    if (this.viewDepth === Depth.Century) {
      badges = this.badges.filter(b => b.year >= item.decade * 10 && b.year <= item.decade * 10 + 9)
    }
    if (!badges.length) return null
    return badges
  }

  // 当前选项是否选中
  isActive(item) {
    const isActive = this.depth === Depth.Month
      ? t => t.getFullYear() === item.year && t.getMonth() === item.month && t.getDate() === item.date
      : this.depth === Depth.Year
        ? t => t.getFullYear() === item.year && t.getMonth() === item.month
        : this.depth === Depth.Decade
          ? t => t.getFullYear() === item.year
          : () => false  

    if (this.mode === 'single' || this.mode === 'multiple') {
      return this.getValues().some(isActive)
    }

    // range mode
    if (this._rangeStart) {
      return isActive(this._rangeStart)
    }
    if (this.value && this.value.length) {
      let inRange
      if (this.depth === Depth.Month) {
        inRange = (t1, t2) => {
          const t1Time = this.makeDate(t1.getFullYear(), t1.getMonth(), t1.getDate()).getTime()
          const t2Time = this.makeDate(t2.getFullYear(), t2.getMonth(), t2.getDate()).getTime()
          const itemTime = this.makeDate(item.year, item.month, item.date).getTime()
          return t1Time <= itemTime && t2Time >= itemTime
        }
      }
      else if (this.depth === Depth.Year) {
        inRange = (t1, t2) => {
          const t1Time = this.makeDate(t1.getFullYear(), t1.getMonth(), 1).getTime()
          const t2Time = this.makeDate(t2.getFullYear(), t2.getMonth(), 1).getTime()
          const itemTime = this.makeDate(item.year, item.month, 1).getTime()
          return t1Time <= itemTime && t2Time >= itemTime
        }
      }
      else if (this.depth === Depth.Decade) {
        inRange = (t1, t2) => {
          return t1.getFullYear() <= item.year && t2.getFullYear() >= item.year
        }
      }
      return inRange(this.value[0], this.value[1])
    }

    return false
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
    if (this.viewDepth === Depth.Century) {
      return this.getValues().some(t => Math.floor(t.getFullYear() / 10) === item.decade)
    }
    return false
  }

  // 获取当前选中的值数组（非多选也转换成数组）
  getValues() {
    return this.multiple || this.range ? (this.value ?? []).slice() : this.value ? [this.value] : []
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

    // 当前非处于最深的视图层次，则往下钻入下一级视图（世纪 -> 年代, 年代 -> 年，或年 -> 月）
    if (this.viewDepth === Depth.Year) {
      this.panelMonth = item.month
      this.viewDepth = Depth.Month
      this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
      return
    }
    if (this.viewDepth === Depth.Decade) {
      this.viewDepth = Depth.Year
      this.panelYear = item.year
      this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
      return
    }
    this.viewDepth = Depth.Decade
    this.panelDecade = item.decade
    this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
  }

  makeDate(year, month, date) {
    const d = new Date(Date.UTC(year, month ?? 0, date ?? 1, 0, 0, 0, 0))
    // 确保 1900 前的年份能正确设置
    d.setUTCFullYear(year)
    return d
  }

  // 选择、添加某一天作为值
  selectDate(item) {
    const date = this.makeDate(item.year, item.month, item.date)

    // 区间模式
    if (this.range) {
      if (!this._rangeStart) {
        this._rangeStart = date
        this.value = []
        return
      }
      const value = [this._rangeStart, date]
      this._rangeStart = null
      this.value = value
    }

    // （离散）多选模式
    else if (this.multiple) {
      const values = this.getValues()
      if (this.isActive(item)) {
        const index = values.findIndex(t => t.getDate() === item.date && t.getMonth() === item.month && t.getFullYear() === item.year)
        if (index !== -1) values.splice(index, 1)
      }
      else {
        values.push(date)
      }
      this.value = values
    }

    // 单选模式
    else {
      if (this.isActive(item)) return
      this.value = date
    }
  }

  // 选择、添加某一月作为值
  selectMonth(item) {
    const date = this.makeDate(item.year, item.month, 1)
    // 区间模式
    if (this.range) {
      if (!this._rangeStart) {
        this._rangeStart = date
        this.value = []
        return
      }
      const value = [this._rangeStart, date]
      this._rangeStart = null
      this.value = value
    }
    // （离散）多选模式
    else if (this.multiple) {
      const values = this.getValues()
      if (this.isActive(item)) {
        const index = values.findIndex(t => t.getMonth() === item.month && t.getFullYear() === item.year)
        if (index !== -1) values.splice(index, 1)
      }
      else {
        values.push(date)
      }
      this.value = values
    }
    // 单选模式
    else {
      if (this.isActive(item)) return
      this.value = date
    }
  }

  // 选择、添加某一年作为值
  selectYear(item) {
    const date = this.makeDate(item.year, 0, 1)
    // 区间模式
    if (this.range) {
      if (!this._rangeStart) {
        this._rangeStart = date
        this.value = []
        return
      }
      const value = [this._rangeStart, date]
      this._rangeStart = null
      this.value = value
    }
    // （离散）多选模式
    else if (this.multiple) {
      const values = this.getValues()
      if (this.isActive(item)) {
        const index = values.findIndex(t => t.getFullYear() === item.year)
        if (index !== -1) values.splice(index, 1)
      }
      else {
        values.push(date)
      }
      this.value = values
    }
    // 单选模式
    else {
      if (this.isActive(item)) return
      this.value = date
    }
  }

  // 显示上个月的选项
  showPrevMonth() {
    if (this.panelMonth > 0) {
      this.panelMonth--
    }
    else {
      this.panelYear--
      this.panelMonth = 11
    }
    this.dispatchEvent(new CustomEvent('prev-month', { detail: { century: this.panelCentury, decade: this.panelDecade, year: this.panelYear, month: this.panelMonth } }))
  }

  // 显示下个月的选项
  showNextMonth() {
    if (this.panelMonth < 11) {
      this.panelMonth++
    }
    else {
      this.panelYear++
      this.panelMonth = 0
    }
    this.dispatchEvent(new CustomEvent('next-month', { detail: { century: this.panelCentury, decade: this.panelDecade, year: this.panelYear, month: this.panelMonth } }))
  }

  // 显示上一年的选项
  showPrevYear() {
    this.panelYear--
    this.dispatchEvent(new CustomEvent('prev-year', { detail: { century: this.panelCentury, decade: this.panelDecade, year: this.panelYear } }))
  }

  // 显示下一年的选项
  showNextYear() {
    this.panelYear++
    this.dispatchEvent(new CustomEvent('next-year', { detail: { century: this.panelCentury, decade: this.panelDecade, year: this.panelYear } }))
  }

  // 显示上个年代（十年）的选项
  showPrevDecade() {
    this.panelDecade--
    this.dispatchEvent(new CustomEvent('prev-decade', { detail: { century: this.panelCentury, decade: this.panelDecade } }))
  }

  // 显示下个年代（十年）的选项
  showNextDecade() {
    this.panelDecade++
    this.dispatchEvent(new CustomEvent('next-decade', { detail: { century: this.panelCentury, decade: this.panelDecade } }))
  }

  // 显示上一个世纪的选项
  showPrevCentury() {
    this.panelCentury--
    this.dispatchEvent(new CustomEvent('prev-century', { detail: { century: this.panelCentury } }))
  }

  // 显示下一个世纪的选项
  showNextCentury() {
    this.panelCentury++
    this.dispatchEvent(new CustomEvent('next-century', { detail: { century: this.panelCentury }}))
  }

  // 点击 prev 按钮
  onPrev() {
    if (this.viewDepth === Depth.Month) {
      this.showPrevMonth()
    }
    else if (this.viewDepth === Depth.Year) {
      this.showPrevYear()
    }
    else if (this.viewDepth === Depth.Decade) {
      this.showPrevDecade()
    }
    else {
      this.showPrevCentury()
    }
  }

  // 点击双重 prev 按钮
  onPrevPrev() {
    if (this.viewDepth === Depth.Month) {
      this.showPrevYear()
    }
  }

  // 点击 next 按钮
  onNext() {
    if (this.viewDepth === Depth.Month) {
      this.showNextMonth()
    }
    else if (this.viewDepth === Depth.Year) {
      this.showNextYear()
    }
    else if (this.viewDepth === Depth.Decade) {
      this.showNextDecade()
    }
    else {
      this.showNextCentury()
    }
  }

  // 点击双重 next 按钮
  onNextNext() {
    if (this.viewDepth === Depth.Month) {
      this.showNextYear()
    }
  }

  // 点击 title，切换到上级视图（月 -> 年，年 -> 年代, 年代 -> 世纪）
  onSwitchDepth() {
    switch (this.viewDepth) {
      case Depth.Month: {
        this.viewDepth = normalizeViewDepth(Depth.Year, this.mindepth, this.depth)
        this.setPanelDate(this.makeDate(this.panelYear, 0))
        this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
        break
      }
      case Depth.Year: {
        this.viewDepth = normalizeViewDepth(Depth.Decade, this.mindepth, this.depth)
        this.setPanelDate(this.makeDate(this.panelYear, 0))
        this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
        break
      }
      case Depth.Decade: {
        this.viewDepth = normalizeViewDepth(Depth.Century, this.mindepth, this.depth)
        this.setPanelDate(this.makeDate(this.panelDecade * 10, 0))
        this.dispatchEvent(new CustomEvent('panel-change', { detail: { viewDepth: this.viewDepth } }))
        break
      }
    }
  }
 
  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
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
}

if (!customElements.get('blocks-date-panel')) {
  customElements.define('blocks-date-panel', BlocksDatePanel)
}
