import '../loading/index.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import {
  __radius_base,
  __color_primary,
  __color_warning,
  __transition_duration,
  __height_base,
  __height_small,
  __height_large,
  __color_primary_light,
} from '../../theme/var.js'
import { range } from '../../common/utils.js'
import { Depth } from './data.js'
import { normalizeMinDepth, normalizeViewDepth, getClosestDate, getFirstDate, getLastDate, getLastDateOfPrevMonth, getFirstDateOfNextMonth } from './helpers.js'
import { boolGetter, boolSetter, enumGetter, enumSetter, intGetter, intSetter } from '../../common/property.js'
import { dispatchEvent } from '../../common/event.js'
import { disabledGetter, disabledSetter } from '../../common/propertyAccessor.js'

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
  cursor: default;
  font-size: 12px;
  background-color: #fff;
}
:host(:focus) {
  outline: 0 none;
}

#layout:focus {
  outline: 0 none;
}
#layout {
  box-sizing: border-box;
  position: relative;
  width: calc(var(--height-base, ${__height_base}) * 7 + 10px);
  height: calc(var(--height-base, ${__height_base}) * 8 + 10px);
}
:host([size="small"]) #layout {
  width: calc(var(--height-small, ${__height_small}) * 7 + 10px);
  height: calc(var(--height-small, ${__height_small}) * 8 + 10px);
}
:host([size="large"]) #layout {
  width: calc(var(--height-large, ${__height_large}) * 7 + 16px);
  height: calc(var(--height-large, ${__height_large}) * 8 + 16px);
}

#header {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  width: 100%;
  height: var(--height-base, ${__height_base});
  line-height: var(--height-base, ${__height_base});
  cursor: default;
}
:host([size="small"]) #header {
  height: var(--height-small, ${__height_small});
  line-height: var(--height-small, ${__height_small});
}
:host([size="large"]) #header {
  height: var(--height-large, ${__height_large});
  line-height: var(--height-large, ${__height_large});
}

.header-button {
  flex: 0 0 var(--height-base, ${__height_base});
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: block;
  width: var(--height-base, ${__height_base});
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0 none;
  background-color: transparent;
  text-align: center;
  outline: 0;
  transition: var(--transition-duration, ${__transition_duration}) all;
}
:host([size="small"]) .header-button {
  flex: 0 0 var(--height-small, ${__height_small});
  width: var(--height-small, ${__height_small});
}
:host([size="large"]) .header-button {
  flex: 0 0 var(--height-large, ${__height_large});
  width: var(--height-large, ${__height_large});
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
  height: var(--height-base, ${__height_base});
  text-align: center;
  font-size: inherit;
}
:host([size="small"]) .header-content {
  height: var(--height-small, ${__height_small});
}
:host([size="large"]) .header-content {
  height: var(--height-large, ${__height_large});
}

.header-title {
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: calc(var(--height-base, ${__height_base}) - 10px);
  line-height: calc(var(--height-base, ${__height_base}) - 10px);
  font-size: inherit;
  margin: 5px auto;
  border: 0 none;
  border-radius: 3px;
  background: transparent;
}
:host([size="small"]) .header-title {
  height: calc(var(--height-small, ${__height_small}) - 10px);
  line-height: calc(var(--height-small, ${__height_small}) - 10px);
}
:host([size="large"]) .header-title {
  height: calc(var(--height-large, ${__height_large}) - 10px);
  line-height: calc(var(--height-large, ${__height_large}) - 10px);
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
  width: 100%;
  height: calc(var(--height-base, ${__height_base}) * 7 + 10px);
}
:host([size="small"]) #body {
  height: calc(var(--height-small, ${__height_small}) * 7 + 10px);
}
:host([size="large"]) #body {
  height: calc(var(--height-large, ${__height_large}) * 7 + 16px);
}

.week-header {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  height: var(--height-base, ${__height_base});
  padding: 0 5px;
  box-shadow: inset 0 -1px 1px #f0f0f0;
  line-height: calc(var(--height-base, ${__height_base}) - 1px);
  font-size: inherit;
  text-align: center;
  transition: var(--transition-duration, ${__transition_duration}) all;
}
:host([size="small"]) .week-header {
  height: var(--height-small, ${__height_small});
  line-height: calc(var(--height-small, ${__height_small}) - 1px);
}
:host([size="large"]) .week-header {
  height: var(--height-large, ${__height_large});
  line-height: calc(var(--height-large, ${__height_large}) - 1px);
}

.week-header span {
  box-sizing: border-box;
  display: block;
  width: var(--height-base, ${__height_base});
}
:host([size="small"]) .week-header span {
  width: var(--height-small, ${__height_small});
}
:host([size="large"]) .week-header span {
  width: var(--height-large, ${__height_large});
}

.button-list {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  padding: 5px;
  transition: var(--transition-duration, ${__transition_duration}) all;
}
:host([size="small"]) .button-list {
  padding: 5px;
}
:host([size="large"]) .button-list {
  padding: 8px;
}

.body-month .button-list {
  height: calc(var(--height-base, ${__height_base}) * 6 + 10px);
}
:host([size="small"]) .body-month .button-list {
  height: calc(var(--height-small, ${__height_small}) * 6 + 10px);
}
:host([size="large"]) .body-month .button-list {
  height: calc(var(--height-large, ${__height_large}) * 6 + 16px);
}

.body-year .button-list,
.body-decade .button-list,
.body-century .button-list {
  height: calc(var(--height-base, ${__height_base}) * 7 + 10px);
}
:host([size="small"]) .body-year .button-list,
:host([size="small"]) .body-decade .button-list,
:host([size="small"]) .body-century .button-list {
  height: calc(var(--height-small, ${__height_small}) * 7 + 10px);
}
:host([size="large"]) .body-year .button-list,
:host([size="large"]) .body-decade .button-list,
:host([size="large"]) .body-century .button-list {
  height: calc(var(--height-large, ${__height_large}) * 7 + 16px);
}

.button-item {
  box-sizing: border-box;
  position: relative;
  margin: 0;
  padding: 1px;
  border: 0;
  background: none;
  font-size: inherit;
  transition: height var(--transition-duration, ${__transition_duration});
}
.button-item:focus {
  outline: 0 none;
}
/* 单选模式，使用圆角 */
.button-item:not(.button-item--rangeIn) span {
  border-radius: var(--radius-base, ${__radius_base});
}
.button-item.button-item--rangeFrom span {
  border-top-left-radius: var(--radius-base, ${__radius_base});
  border-bottom-left-radius: var(--radius-base, ${__radius_base});
}
.button-item.button-item--rangeTo span {
  border-top-right-radius: var(--radius-base, ${__radius_base});
  border-bottom-right-radius: var(--radius-base, ${__radius_base});
}
/* range 模式，左右按钮移除间隙 */
.button-item.button-item--rangeIn {
  padding: 1px 0;
}

.button-item span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: color var(--transition-duration, ${__transition_duration}),
    background var(--transition-duration, ${__transition_duration});
}
.button-item:focus span {
  background-color: #f0f0f0;
  color: var(--color-primary, ${__color_primary});
}

/* 7 col * 5 row */
.body-month .button-item {
  width: var(--height-base, ${__height_base});
  height: var(--height-base, ${__height_base});
}
:host([size="small"]) .body-month .button-item {
  width: var(--height-small, ${__height_small});
  height: var(--height-small, ${__height_small});
}
:host([size="large"]) .body-month .button-item {
  width: var(--height-large, ${__height_large});
  height: var(--height-large, ${__height_large});
}

/* 3 col * 4 row */
.body-year .button-item {
  width: calc(var(--height-base, ${__height_base}) * 7 / 3);
  height: calc(var(--height-base, ${__height_base}) * 7 / 4);
}
:host([size="small"]) .body-year .button-item {
  width: calc(var(--height-small, ${__height_small}) * 7 / 3);
  height: calc(var(--height-small, ${__height_small}) * 7 / 4);
}
:host([size="large"]) .body-year .button-item {
  width: calc(var(--height-large, ${__height_large}) * 7 / 3);
  height: calc(var(--height-large, ${__height_large}) * 7 / 4);
}

/* 2 col * 5 row */
.body-century .button-item,
.body-decade .button-item {
  width: calc(var(--height-base, ${__height_base}) * 7 / 2);
  height: calc(var(--height-base, ${__height_base}) * 7 / 5);
}
:host([size="small"]) .body-century .button-item,
:host([size="small"]) .body-decade .button-item {
  width: calc(var(--height-small, ${__height_small}) * 7 / 2);
  height: calc(var(--height-small, ${__height_small}) * 7 / 5);
}
:host([size="large"]) .body-century .button-item,
:host([size="large"]) .body-decade .button-item {
  width: calc(var(--height-large, ${__height_large}) * 7 / 2);
  height: calc(var(--height-large, ${__height_large}) * 7 / 5);
}


.button-item.button-item--otherMonth span,
.button-item[disabled] span {
  color: #ccc;
}

.button-item:not([disabled]):hover span {
  background-color: #f0f0f0;
}

.button-item.button-item--today span {
  color: var(--color-primary, ${__color_primary});
  text-shadow: 0 0 1px var(--color-primary, ${__color_primary});
}

.button-item.button-item--includesActive span {
  color: var(--color-primary, ${__color_primary});
  text-shadow: 0 0 1px var(--color-primary, ${__color_primary});
}

.button-item.button-item--rangeIn span,
.button-item.button-item--rangeIn:hover span,
.button-item.button-item--rangeIn:active span {
  background-color: var(--color-primary-light, ${__color_primary_light});
  color: #fff;
}

.button-item.button-item--active span,
.button-item.button-item--active:hover span,
.button-item.button-item--active:active span {
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
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255,255,255,.8);
}
:host([loading]) .body-loading {
  display: block;
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
      <bl-loading></bl-loading>
    </div>
  </div>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML


export default class BlocksDate extends HTMLElement {
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

    this._$pool = []
    this._value = []

    // 面板视图深度层级
    this.viewDepth = this.startdepth

    // 设置面板起始视图状态
    this.setPanelDate(this.closestDate ?? new Date())

    $panel.onclick = e => {
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
        this.rollUp()
      }
      else if (target.classList.contains('button-item')) {
        this.onClickItem(this._parseItem(target))
      }
      else if (target.parentElement.classList.contains('button-item')) {
        this.onClickItem(this._parseItem(target.parentElement))
      }
      this.focus()
    }

    // range 选择模式，鼠标移入，渲染选中效果
    $panel.onmouseover = e => {
      if (!this.isLeafDepth()) return
      if (!e.target.classList.contains('button-item')) return
      if (!this.range) return
      if (!this.rangeFrom) return
      if (this.rangeTo) return
      this.maybeRangeTo = this._parseItem(e.target)
      this.render()
    }
  }

  get badges() {
    return this._badges ?? []
  }

  // 在一组日期中，获取距离当前时刻最接近的那一个日期
  get closestDate() {
    return getClosestDate(this.getValues())
  }

  /**
   * @param {Array<{year: number, month?: number, date?: number, label?: string}>} value
   */
  set badges(value) {
    this._badges = value
    this.render()
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

  // 年代列表
  get decadeList() {
    const decadeFrom = this.panelCentury * 10
    const decadeTo = decadeFrom + 9
    const list = []
    for (let decade = decadeFrom; decade <= decadeTo; decade += 1) {
      list.push({
        label: `${decade * 10} ~ ${decade * 10 + 9}`,
        century: this.panelCentury,
        decade
      })
    }
    return list
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get depth() {
    return enumGetter('depth', [Depth.Month, Depth.Year, Depth.Decade])(this)
  }

  set depth(value) {
    enumSetter('depth', [Depth.Month, Depth.Year, Depth.Decade])(this, value)
  }

  // 是否已经选够最大数量的值
  get limitReached() {
    if (!this.multiple || !this.max) return false
    let max = Math.trunc(this.max)
    if (max < 1) max = 1
    const len = this.value?.length ?? 0
    return len >= max
  }

  get loading() {
    return boolGetter('loading')(this)
  }

  set loading(value) {
    boolSetter('loading')(this, value)
  }

  get max() {
    return intGetter('max')(this) || null
  }

  set max(value) {
    intSetter('max')(this, value)
  }

  get mindepth() {
    return normalizeMinDepth(this.getAttribute('mindepth'), this.depth)
  }

  set mindepth(value) {
    this.setAttribute('mindepth', normalizeMinDepth(value, this.depth))
  }

  get mode() {
    return enumGetter('mode', [null, 'multiple', 'range'])(this)
  }

  set mode(value) {
    enumSetter('mode', [null, 'multiple', 'range'])(this, value)
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

  get multiple() {
    return this.mode === 'multiple'
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

  get panelMonth() {
    return this._panelMonth
  }

  set panelMonth(value) {
    if (this._panelMonth === value) return
    this._panelMonth = value
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

  get range() {
    return this.mode === 'range'
  }

  get startdepth() {
    return normalizeViewDepth(this.getAttribute('startdepth'), this.mindepth, this.depth)
  }

  set startdepth(value) {
    this.setAttribute('startdepth', normalizeViewDepth(value, this.mindepth, this.depth))
  }

  get startWeekOn() {
    return this.getAttribute('start-week-on') ?? 1
  }

  set startWeekOn(value) {
    this.setAttribute('start-week-on', value % 7)
  }

  get title() {
    if (this.viewDepth === Depth.Century) {
      return `${this.panelCentury * 100} ~ ${this.panelCentury * 100 + 99}`
    }
    if (this.viewDepth === Depth.Decade) {
      const [from, to] = this.getDecadeRange(this.panelDecade)
      return `${from} ~ ${to}`
    }
    if (this.viewDepth === Depth.Year) {
      return `${this.panelYear}`
    }
    return `${this.panelYear} / ${this.panelMonth + 1}`
  }

  get today() {
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate()
    }
  }

  get value() {
    return this.mode === null ? this._value[0] ?? null : this._value
  }

  set value(value) {
    // 多选
    if (this.multiple) {
      if (!Array.isArray(value) || !value.every(date => date instanceof Date)) {
        value = []
      }
      else {
        value = value.slice()
      }


      if (this.max && value.length > this.max) {
        console.error('选择的日期值超过最大数量限制')
        return
      }

      this._value = value
      this.render()
      dispatchEvent(this, 'change', { detail: { value: this._value } })
    }

    // 区间
    else if (this.range) {
      if (!Array.isArray(value) || value.length !== 2 || !value.every(date => date instanceof Date)) {
        value = []
      }
      else {
        value = value.slice()
        value.sort((a, b) => a.getTime() - b.getTime())
      }

      this._value = value

      this.maybeRangeTo = null
      if (value.length) {
        this.rangeFrom = this.makeItem(this.value[0], this.viewDepth)
        this.rangeTo = this.makeItem(this.value[1], this.viewDepth)
      }
      else {
        this.rangeFrom = this.rangeTo = null
      }

      this.render()
      dispatchEvent(this, 'change', { detail: { value: this._value } })
    }

    // 单选
    else {
      if (Array.isArray(value)) value = value[0]
      if (!(value instanceof Date)) value = null
      this._value = value ? [value] : []
      this.render()
      dispatchEvent(this, 'change', { detail: { value: this._value } })
    }
  }

  get viewDepth() {
    return normalizeViewDepth(this._viewDepth, this.mindepth, this.depth)
  }

  set viewDepth(value) {
    if (this._viewDepth === value) return
    this._viewDepth = normalizeViewDepth(value, this.mindepth, this.depth)
    this.render()
  }

  get weekHeaders() {
    const headers = ['日', '一', '二', '三', '四', '五', '六']
    return headers.slice(this.startWeekOn).concat(headers.slice(0, this.startWeekOn))
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

  setPanelDate(date) {
    const panelYear = date.getFullYear()
    this.panelCentury = Math.floor(panelYear / 100)
    this.panelDecade = [Depth.Century].includes(this.viewDepth) ? undefined : Math.floor(panelYear / 10)
    this.panelYear = [Depth.Century, Depth.Decade].includes(this.viewDepth) ? undefined : panelYear
    this.panelMonth = [Depth.Century, Depth.Decade, Depth.Year].includes(this.viewDepth) ? undefined : date.getMonth()
  }

  _parseItem($item) {
    return {
      label: $item.dataset.label,
      century: +$item.dataset.century,
      decade: +$item.dataset.decade,
      year: +$item.dataset.year,
      month: +$item.dataset.month,
      date: +$item.dataset.date,
    }
  }

  _renderHeaderButtons() {
    if (this.viewDepth === Depth.Month) {
      this.$prevPrev.style.cssText = ''
      this.$nextNext.style.cssText = ''
    }
    else {
      this.$prevPrev.style.cssText = 'transfrom:scale(0,0);flex:0 0 0'
      this.$nextNext.style.cssText = 'transfrom:scale(0,0);flex:0 0 0'
    }
  }

  _renderTitle() {
    this.$title.textContent = this.title
  }

  _renderWeekHeader() {
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

  _renderLoading() {
    this.$loading.style.display = this.loading ? '' : 'none'
  }

  _renderItems() {
    ;['body-century', 'body-decade', 'body-year', 'body-month'].forEach(klass => {
      this.$content.classList.remove(klass)
    })
    const contentPanelClass = `body-${this.viewDepth}`
    this.$content.classList.add(contentPanelClass)

    if (this.viewDepth === Depth.Month) {
      this._renderDateItems()
    }
    else if (this.viewDepth === Depth.Year) {
      this._renderMonthItems()
    }
    else if (this.viewDepth === Depth.Decade) {
      this._renderYearItems()
    }
    else if (this.viewDepth === Depth.Century) {
      this._renderDecadeItems()
    }
  }

  // 只保留 N 个日期按钮
  _ensureItemCount(n) {
    const $list = this.$list
    let len = $list.children.length ?? 0
    while (len++ < n) {
      if (this._$pool.length) {
        $list.appendChild(this._$pool.pop())
      }
      else {
        const el = document.createElement('button')
        el.className = 'button-item'
        el.appendChild(document.createElement('span'))
        $list.appendChild(el)
      }
    }
    len = $list.children.length
    while (len-- > n) {
      this._$pool.push($list.removeChild($list.lastElementChild))
    }
    return Array.prototype.slice.call($list.children)
  }

  _renderBadge($el, item) {
    const badges = this.getBadges(item)
    let $badge = $el.querySelector('.button-badge')
    if (badges === null) {
      $el.title = ''
      if ($badge) $el.removeChild($badge)
      return
    }

    if (!$badge) {
      $badge = $el.appendChild(document.createElement('i'))
    }

    $badge.classList.add('button-badge')

    let title = badges.filter(badge => badge.label).map(badge => badge.label).join('\n')
    if (title.length > 100) title = title.slice(0, 97) + '...'
    $el.title = title
  }

  _renderDecadeItems() {
    if (!this.decadeList.length) return
    this._ensureItemCount(10).forEach(($el, i) => {
      const item = this.decadeList[i]
      boolSetter('disabled')($el, false)
      $el.classList.toggle('button-item--otherMonth', false)
      $el.classList.toggle('button-item--today', false)
      $el.classList.toggle('button-item--active', false)
      $el.classList.toggle('button-item--includesActive', this.includesActive(item))
      $el.classList.toggle('button-item--rangeFrom', false)
      $el.classList.toggle('button-item--rangeTo', false)
      $el.classList.toggle('button-item--rangeIn', false)

      $el.dataset.century = item.century
      $el.dataset.decade = item.decade
      $el.dataset.year = null
      $el.dataset.month = null
      $el.dataset.date = null
      $el.dataset.label = item.label

      $el.lastElementChild.innerHTML = item.label
      this._renderBadge($el, item)
    })
  }

  _renderYearItems() {
    if (!this.yearList.length) return
    this._ensureItemCount(10).forEach(($el, i) => {
      const item = this.yearList[i]
      boolSetter('disabled')($el, false)
      $el.classList.toggle('button-item--otherMonth', false)
      $el.classList.toggle('button-item--today', false)
      $el.classList.toggle('button-item--active', this.isActiveLeaf(item))
      $el.classList.toggle('button-item--includesActive', this.includesActive(item))
      $el.classList.toggle('button-item--rangeFrom', this.range && this.isRangeFrom(item))
      $el.classList.toggle('button-item--rangeTo', this.range && this.isRangeTo(item))
      $el.classList.toggle('button-item--rangeIn', this.range && this.isInRange(item))
      
      $el.dataset.century = item.century
      $el.dataset.decade = item.decade
      $el.dataset.year = item.year
      $el.dataset.month = null
      $el.dataset.date = null
      $el.dataset.label = item.label

      $el.lastElementChild.innerHTML = item.label
      this._renderBadge($el, item)
    })
  }

  _renderMonthItems() {
    if (!this.monthList.length) return
    this._ensureItemCount(12).forEach(($el, i) => {
      const item = this.monthList[i]
      $el.classList.toggle('button-item--otherMonth', false)
      $el.classList.toggle('button-item--today', false)
      $el.classList.toggle('button-item--active', this.isActiveLeaf(item))
      $el.classList.toggle('button-item--includesActive', this.includesActive(item))
      $el.classList.toggle('button-item--rangeFrom', this.range && this.isRangeFrom(item))
      $el.classList.toggle('button-item--rangeTo', this.range && this.isRangeTo(item))
      $el.classList.toggle('button-item--rangeIn', this.range && this.isInRange(item))

      boolSetter('disabled')($el, false)
      $el.dataset.century = item.century
      $el.dataset.decade = item.decade
      $el.dataset.year = item.year
      $el.dataset.month = item.month
      $el.dataset.date = null
      $el.dataset.label = item.label
      $el.lastElementChild.innerHTML = item.label
      this._renderBadge($el, item)
    })
  }

  _renderDateItems() {
    if (!this.dateList.length) return
    this._ensureItemCount(42).forEach(($el, i) => {
      const item = this.dateList[i]
      boolSetter('disabled')($el, !this.isActiveLeaf(item) && this.isDisabledLeaf(item))
      $el.classList.toggle('button-item--otherMonth', !this.isCurrentMonth(item))
      $el.classList.toggle('button-item--today', this.isToday(item))
      $el.classList.toggle('button-item--active', this.isActiveLeaf(item))
      $el.classList.toggle('button-item--includesActive', false)
      $el.classList.toggle('button-item--rangeFrom', this.range && this.isRangeFrom(item))
      $el.classList.toggle('button-item--rangeTo', this.range && this.isRangeTo(item))
      $el.classList.toggle('button-item--rangeIn', this.range && this.isInRange(item))

      $el.dataset.century = item.century
      $el.dataset.decade = item.decade
      $el.dataset.year = item.year
      $el.dataset.month = item.month
      $el.dataset.date = item.date
      $el.dataset.label = item.label

      $el.lastElementChild.innerHTML = item.label
      this._renderBadge($el, item)
    })
  }

  render() {
    this._renderHeaderButtons()
    this._renderTitle()
    this._renderWeekHeader()
    this._renderLoading()
    this._renderItems()
  }

  getDecadeRange(decade) {
    let from = decade * 10
    const to = from + 9
    return [from, to]
  }

  // 是否当前面板对应的月（面板中，根据周起始日，可能包含上月末的几天，以及下月初的某几天）
  isCurrentMonth(item) {
    return item.month === this.panelMonth
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

  // 获取当前选中的值数组（非多选也转换成数组）
  getValues() {
    return this.multiple || this.range ? (this.value ?? []).slice() : this.value ? [this.value] : []
  }

  isRangeFrom(item) {
    let obj = this.rangeFrom
    if (!obj) return false
    const obj2 = this.rangeTo ?? this.maybeRangeTo
    if (obj2 && this.itemToDate(obj).getTime() > this.itemToDate(obj2).getTime()) {
      obj = obj2
    }
    return ['year', 'month', 'date'].every(key => obj[key] === item[key])
  }

  isRangeTo(item) {
    let obj = this.rangeFrom
    if (!obj) return false
    const obj2 = this.rangeTo ?? this.maybeRangeTo
    if (obj2 && this.itemToDate(obj).getTime() < this.itemToDate(obj2).getTime()) {
      obj = obj2
    }
    return ['year', 'month', 'date'].every(key => obj[key] === item[key])
  }

  // 当前选项是否是今天
  // TODO
  isToday(item) {
    return item.year === this.today.year && item.month === this.today.month && item.date === this.today.date
  }  

  // 当前选项是否渲染成禁用，仅作用于末级 depth
  isDisabledLeaf(item) {
    if (this.viewDepth !== this.depth) return false
    // 检查是否抵达数量上限，
    if (this.limitReached) return true
    // 通过外部传入的 disableMethod 检查
    // 校验（depth 末级）选项是否可用
    // (data: { year: number, month?: number, date?: number }) => boolean
    return this.disableMethod ?
      this.disableMethod({
        year: item.year,
        month: item.month,
        date: item.date,
      })
      : false
  }

  _isDate(item, date) {
    return date.getFullYear() === item.year && date.getMonth() === item.month && date.getDate() === item.date
  }

  _isMonth(item, date) {
    return date.getFullYear() === item.year && date.getMonth() === item.month
  }

  _isYear(item, date) {
    return date.getFullYear() === item.year
  }

  isInRange(item) {
    if (!this.isLeafDepth()) return false
    if (!this.rangeFrom) return false
    if (!this.rangeTo && !this.maybeRangeTo) return false
    let inRange
    if (this.depth === Depth.Month) {
      inRange = (t1, t2) => {
        const t1Time = this.makeDate(t1.getFullYear(), t1.getMonth(), t1.getDate()).getTime()
        const t2Time = this.makeDate(t2.getFullYear(), t2.getMonth(), t2.getDate()).getTime()
        const itemTime = this.makeDate(item.year, item.month, item.date).getTime()
        return Math.min(t1Time, t2Time) <= itemTime && Math.max(t1Time, t2Time) >= itemTime
      }
    }
    else if (this.depth === Depth.Year) {
      inRange = (t1, t2) => {
        const t1Time = this.makeDate(t1.getFullYear(), t1.getMonth(), 1).getTime()
        const t2Time = this.makeDate(t2.getFullYear(), t2.getMonth(), 1).getTime()
        const itemTime = this.makeDate(item.year, item.month, 1).getTime()
        return Math.min(t1Time, t2Time) <= itemTime && Math.max(t1Time, t2Time) >= itemTime
      }
    }
    else if (this.depth === Depth.Decade) {
      inRange = (t1, t2) => {
        return Math.min(t1.getFullYear(), t2.getFullYear()) <= item.year && Math.max(t1.getFullYear(), t2.getFullYear()) >= item.year
      }
    }

    const from = this.rangeFrom
    const to = this.rangeTo ?? this.maybeRangeTo
    if (this.depth === Depth.Month) {
      return inRange(
        this.makeDate(from.year, from.month, from.date),
        this.makeDate(to.year, to.month, to.date)
      )
    }
    if (this.depth === Depth.Year) {
      return inRange(
        this.makeDate(from.year, from.month, 1),
        this.makeDate(to.year, to.month, 1)
      )
    }
    if (this.depth === Depth.Decade) {
      return inRange(
        this.makeDate(from.year, 0, 1),
        this.makeDate(to.year, 0, 1)
      )
    }
  }

  // 当前选项是否选中
  isActiveLeaf(item) {
    if (!this.isLeafDepth()) return false

    if (this.range) {
      return this.isRangeFrom(item) || this.isRangeTo(item)
    }

    let isActive = this.depth === Depth.Month ? this._isDate.bind(this, item)
      : this.depth === Depth.Year ? this._isMonth.bind(this, item)
      : this.depth === Depth.Decade ? this._isYear.bind(this, item)
      : () => false

    if (this.mode == null) {
      return this.getValues().some(isActive)
    }

    if (this.mode === 'multiple') {
      return this.getValues().some(isActive)
    }
  }

  // 子节点是否包含今天
  includesToday(item) {
    const { year, month } = this.today
    switch (this.viewDepth) {
      case Depth.Year:
        return item.year === year && item.month === month
      case Depth.Decade:
        return item.year === year
      case Depth.Century:
        return Math.floor(year / 10) === item.decade
      default: return false
    }
  }

  // 是否有子结点选中（年下的月、日，月下的日等等）
  includesActive(item) {
    const values = this.getValues()
    if (!values.length) return false

    if (this.range) {
      const fromTime = values[0].getTime()
      const toTime = values[1].getTime()
      switch (this.viewDepth) {
        case Depth.Year: {
          const t1 = this.makeDate(item.year, item.month, 1)
          const t2 = this.makeDate(item.year, item.month + 1, 0)
          return fromTime <= t2 && toTime >= t1
        }
        case Depth.Decade: {
          const t1 = this.makeDate(item.year, 0, 1)
          const t2 = this.makeDate(item.year, 11, 31)
          return fromTime <= t2 && toTime >= t1
        }
        case Depth.Century: {
          const t1 = this.makeDate(item.decade * 10, 0, 1)
          const t2 = this.makeDate(item.decade * 10 + 9, 11, 31)
          return fromTime <= t2 && toTime >= t1
        }
        default: return false
      }
    }
    else {
      switch (this.viewDepth) {
        case Depth.Year:
          return values.some(t => t.getMonth() === item.month && t.getFullYear() === item.year)
        case Depth.Decade:
          return values.some(t => t.getFullYear() === item.year)
        case Depth.Century:
          return values.some(t => Math.floor(t.getFullYear() / 10) === item.decade)
        default: return false
      }
    }
  }

  // 当前是否最深的选择深度
  isLeafDepth() {
    return this.viewDepth === this.depth
  }

  // 点击选项时的 handler
  onClickItem(item) {
    // 点击 disabled 的日期，且该日期非激活状态，则直接返回
    // 如果该日期为激活状态，则可以取消选择（多选时）
    if (this.isDisabledLeaf(item) && !this.isActiveLeaf(item)) {
      return
    }

    // 当前非最深层次，直接往下钻入
    if (!this.isLeafDepth()) {
      return this.drillDown(item)
    }

    // 月视图，当前操作是选择天
    if (this.viewDepth === Depth.Month) {
      return this.selectDate(item)
    }

    // 年视图，当前操作是选择月
    if (this.viewDepth === Depth.Year) {
      return this.selectMonth(item)
    }

    // 年代视图，当前操作是选择年
    if (this.viewDepth === Depth.Decade) {
      return this.selectYear(item)
    }
  }

  // 选择、添加某一天作为值
  selectDate(item) {
    if (this.disabled) return

    const date = this.makeDate(item.year, item.month, item.date)

    // 区间模式
    if (this.range) {
      this.maybeRangeTo = null
      if (!this.rangeFrom || this.rangeTo) {
        this.rangeTo = null
        this.rangeFrom = item
        this._value = []
        this.render()
        return
      }
      this.rangeTo = item
      this.value = [
        this.makeDate(this.rangeFrom.year, this.rangeFrom.month, this.rangeFrom.date),
        this.makeDate(this.rangeTo.year, this.rangeTo.month, this.rangeTo.date),
      ]
    }

    // （离散）多选模式
    else if (this.multiple) {
      const values = this.getValues()
      if (this.isActiveLeaf(item)) {
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
      if (this.isActiveLeaf(item)) return
      this.value = date
    }
  }

  // 选择、添加某一月作为值
  selectMonth(item) {
    if (this.disabled) return

    const date = this.makeDate(item.year, item.month, 1)
    // 区间模式
    if (this.range) {
      this.maybeRangeTo = null
      if (!this.rangeFrom || this.rangeTo) {
        this.rangeTo = null
        this.rangeFrom = item
        this._value = []
        this.render()
        return
      }
      this.rangeTo = item
      this.value = [
        this.makeDate(this.rangeFrom.year, this.rangeFrom.month, 1),
        this.makeDate(this.rangeTo.year, this.rangeTo.month, 1),
      ]
    }
    // （离散）多选模式
    else if (this.multiple) {
      const values = this.getValues()
      if (this.isActiveLeaf(item)) {
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
      if (this.isActiveLeaf(item)) return
      this.value = date
    }
  }

  // 选择、添加某一年作为值
  selectYear(item) {
    if (this.disabled) return

    const date = this.makeDate(item.year, 0, 1)

    // 区间模式
    if (this.range) {
      this.maybeRangeTo = null
      if (!this.rangeFrom || this.rangeTo) {
        this.rangeTo = null
        this.rangeFrom = item
        this._value = []
        this.render()
        return
      }
      this.rangeTo = item
      this.value = [
        this.makeDate(this.rangeFrom.year, 0, 1),
        this.makeDate(this.rangeTo.year, 0, 1),
      ]
    }

    // （离散）多选模式
    else if (this.multiple) {
      const values = this.getValues()
      if (this.isActiveLeaf(item)) {
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
      if (this.isActiveLeaf(item)) return
      this.value = date
    }
  }

  // 当前非处于最深的视图层次，则钻入下一级视图
  drillDown(item) {
    if (this.isLeafDepth()) return

    switch (this.viewDepth) {
      // 年 -> 月
      case Depth.Year: {
        this.panelMonth = item.month
        this.viewDepth = Depth.Month
        dispatchEvent(this, 'panel-change', { detail: { viewDepth: this.viewDepth } })
        break
      }
      // 年代 -> 年
      case Depth.Decade: {
        this.viewDepth = Depth.Year
        this.panelYear = item.year
        dispatchEvent(this, 'panel-change', { detail: { viewDepth: this.viewDepth } })
        break
      }
      // 世纪 -> 年代
      default: {
        this.viewDepth = Depth.Decade
        this.panelDecade = item.decade
        dispatchEvent(this, 'panel-change', { detail: { viewDepth: this.viewDepth } })
      }
    }
  }

  // 当前非处于最浅视图层次，则切换到上级视图
  rollUp() {
    switch (this.viewDepth) {
      // 月 -> 年
      case Depth.Month: {
        this.viewDepth = normalizeViewDepth(Depth.Year, this.mindepth, this.depth)
        this.setPanelDate(this.makeDate(this.panelYear, 0))
        dispatchEvent(this, 'panel-change', { detail: { viewDepth: this.viewDepth } })
        break
      }
      // 年 -> 年代
      case Depth.Year: {
        this.viewDepth = normalizeViewDepth(Depth.Decade, this.mindepth, this.depth)
        this.setPanelDate(this.makeDate(this.panelYear, 0))
        dispatchEvent(this, 'panel-change', { detail: { viewDepth: this.viewDepth } })
        break
      }
      // 年代 -> 世纪
      case Depth.Decade: {
        this.viewDepth = normalizeViewDepth(Depth.Century, this.mindepth, this.depth)
        this.setPanelDate(this.makeDate(this.panelDecade * 10, 0))
        dispatchEvent(this, 'panel-change', { detail: { viewDepth: this.viewDepth } })
        break
      }
    }
  }

  makeDate(year, month, date) {
    const d = new Date(Date.UTC(year, month ?? 0, date ?? 1, 0, 0, 0, 0))
    // 确保 1900 前的年份能正确设置
    d.setUTCFullYear(year)
    return d
  }

  // 仅限 year、month、date 三种 item
  itemToDate(item) {
    return this.makeDate(item.year, item.month || 0, item.date || 1)
  }

  makeItem(dateObj, depth) {    
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth()
    const date = dateObj.getDate()
    const century = Math.floor(year / 100)
    const decade = Math.floor(year / 10)
    let label = depth === Depth.Month ? String(date)
      : depth === Depth.Year ? String(month + 1)
      : depth === Depth.Decade ? String(year)
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
    if (this.panelMonth > 0) {
      this.panelMonth--
    }
    else {
      this.panelYear--
      this.panelMonth = 11
    }
    dispatchEvent(this, 'prev-month', { detail: { century: this.panelCentury, decade: this.panelDecade, year: this.panelYear, month: this.panelMonth } })
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
    dispatchEvent(this, 'next-month', { detail: { century: this.panelCentury, decade: this.panelDecade, year: this.panelYear, month: this.panelMonth } })
  }

  // 显示上一年的选项
  showPrevYear() {
    this.panelYear--
    dispatchEvent(this, 'prev-year', { detail: { century: this.panelCentury, decade: this.panelDecade, year: this.panelYear } })
  }

  // 显示下一年的选项
  showNextYear() {
    this.panelYear++
    dispatchEvent(this, 'next-year', { detail: { century: this.panelCentury, decade: this.panelDecade, year: this.panelYear } })
  }

  // 显示上个年代（十年）的选项
  showPrevDecade() {
    this.panelDecade--
    dispatchEvent(this, 'prev-decade', { detail: { century: this.panelCentury, decade: this.panelDecade } })
  }

  // 显示下个年代（十年）的选项
  showNextDecade() {
    this.panelDecade++
    dispatchEvent(this, 'next-decade', { detail: { century: this.panelCentury, decade: this.panelDecade } })
  }

  // 显示上一个世纪的选项
  showPrevCentury() {
    this.panelCentury--
    dispatchEvent(this, 'prev-century', { detail: { century: this.panelCentury } })
  }

  // 显示下一个世纪的选项
  showNextCentury() {
    this.panelCentury++
    dispatchEvent(this, 'next-century', { detail: { century: this.panelCentury }})
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

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  disconnectedCallback() {
  }

  adoptedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }
}

if (!customElements.get('bl-date')) {
  customElements.define('bl-date', BlocksDate)
}
