import type {
  WeekNumber,
  DecadeModel,
  YearModel,
  MonthModel,
  DayModel,
  ItemModel,
  MaybeLeafModel,
  MaybeLeafDepth,
} from './type.js'
import { Depth } from './type.js'
import { range } from '../../common/utils.js'

export const Depths = [Depth.Month, Depth.Year, Depth.Decade, Depth.Century] as const
export const LeafDepths = [Depth.Month, Depth.Year, Depth.Decade] as const

export const DepthValue = Object.freeze({
  [Depth.Century]: 0,
  [Depth.Decade]: 1,
  [Depth.Year]: 2,
  [Depth.Month]: 3,
})

/**
 * 规范最小的深度取值
 */
export function normalizeMinDepth(min: Depth, depth: MaybeLeafDepth) {
  if (!min) return Depth.Century
  return DepthValue[depth] < DepthValue[min] ? depth : min
}

/**
 * 规范面板深度取值
 */
export function normalizeActiveDepth(view: Depth, min: Depth, depth: MaybeLeafDepth): Depth {
  if (!view) return depth as Depth
  if (DepthValue[view] < DepthValue[min]) {
    view = min
  }
  if (DepthValue[view] > DepthValue[depth]) {
    view = depth
  }
  return view as Depth
}

export function maybeLeafModel(model: ItemModel): model is MaybeLeafModel {
  return typeof model.year === 'number'
}
export function isDecadeModel(model: ItemModel): model is DecadeModel {
  return typeof model.decade === 'number'
}
export function isYearModel(model: ItemModel): model is YearModel {
  return typeof model.year === 'number' && model.month == null
}
export function isMonthModel(model: ItemModel): model is MonthModel {
  return typeof model.month === 'number' && model.date == null
}
export function isDayModel(model: ItemModel): model is DayModel {
  return typeof model.date === 'number'
}

// 生成日期列表（按月动态生成）
export function generateDates(
  century: number,
  decade: number,
  year: number,
  month: number,
  startWeekOn: number
): DayModel[] {
  if (year == null || month == null) return []

  // 该月的第一天
  const firstDate = getFirstDate(year, month)
  // 该月的最后一天
  const lastDate = getLastDate(year, month)
  // 该月的所有日
  const results = range(1, lastDate.getUTCDate()).map(date => ({
    label: String(date),
    century,
    decade,
    year,
    month,
    date,
  }))

  // 该月第一天在星期中的序号，如果不是从配置的 startWeekOn 开始，则在前面补上个月的日期
  const firstDateIndex = firstDate.getDay()
  if (firstDateIndex !== startWeekOn) {
    // 上个月最后一天
    const prevLastDate = getLastDateOfPrevMonth(year, month)
    const prevYear = prevLastDate.getUTCFullYear()
    const prevMonth = prevLastDate.getUTCMonth()
    let date = prevLastDate.getUTCDate()
    // 需要补的天数
    let n = (7 + firstDateIndex - startWeekOn) % 7
    while (n--) {
      results.unshift({
        label: String(date),
        century: Math.floor(prevYear / 100),
        decade: Math.floor(prevYear / 10),
        year: prevYear,
        month: prevMonth,
        date: date,
      })
      date--
    }
  }

  // 2. 末尾用下个月的日期填满，总共是 6 * 7 = 42 天
  // 下个月第一天
  const nextFirstDate = getFirstDateOfNextMonth(year, month)
  const nextYear = nextFirstDate.getUTCFullYear()
  const nextMonth = nextFirstDate.getUTCMonth()
  let date = nextFirstDate.getUTCDate()
  while (results.length < 42) {
    results.push({
      label: String(date),
      century: Math.floor(nextYear / 100),
      decade: Math.floor(nextYear / 10),
      year: nextYear,
      month: nextMonth,
      date: date,
    })
    date++
  }

  return results
}

export function generateMonths(century: number, decade: number, year: number): MonthModel[] {
  const results = range(0, 11).map(month => ({
    label: String(month + 1),
    century,
    decade,
    year,
    month,
    date: undefined,
  }))
  return results
}

// 年份列表（10 年一组）
export function generateYears(century: number, decade: number): YearModel[] {
  const from = decade * 10
  const to = from + 9
  return range(from, to).map(year => ({
    label: String(year),
    century,
    decade,
    year,
    month: undefined,
    date: undefined,
  }))
}

// 年代列表
export function generateDecades(century: number): DecadeModel[] {
  const decadeFrom = century * 10
  const decadeTo = decadeFrom + 9
  const list: any[] = []
  for (let decade = decadeFrom; decade <= decadeTo; decade += 1) {
    list.push({
      label: `${decade * 10} ~ ${decade * 10 + 9}`,
      century,
      decade,
      year: undefined,
      month: undefined,
      date: undefined,
    })
  }
  return list
}

export function makeDate(year: number, month?: number, date?: number) {
  const d = new Date(Date.UTC(year, month ?? 0, date ?? 1, 0, 0, 0, 0))
  // 确保 1900 前的年份能正确设置
  d.setUTCFullYear(year)
  return d
}

export function normalizeNumber(value: any): number | null {
  if (typeof value === 'number' && !Object.is(value, NaN)) {
    return Math.trunc(value)
  }
  value = parseInt(String(value), 10)
  return Object.is(value, NaN) ? null : value
}

export function yearToDecade(year: number) {
  return Math.floor(year / 10)
}

export function yearToCentury(year: number) {
  return Math.floor(year / 100)
}

export function decadeToCentury(decade: number) {
  return decade / 10
}

export function isYearInDecade(year: number, decade: number) {
  return yearToDecade(year) == decade
}

export function isYearInCentury(year: number, century: number) {
  return yearToCentury(year) === century
}

export function firstYearOfDecade(decade: number) {
  return decade * 10
}

export function lastYearOfDecade(decade: number) {
  return decade * 10 + 9
}

export function firstYearOfCentury(century: number) {
  return century * 100
}

export function lastYearOfCentury(century: number) {
  return century * 100 + 99
}

export function generateWeekHeaders(startWeekOn: WeekNumber) {
  const headers = ['日', '一', '二', '三', '四', '五', '六']
  return headers.slice(startWeekOn).concat(headers.slice(0, startWeekOn))
}

// 当前选项是否是今天
export function isToday(model: ItemModel) {
  const today = new Date()
  return (
    model.year === today.getUTCFullYear() && model.month === today.getUTCMonth() && model.date === today.getUTCDate()
  )
}

export function isAllEqual(arr1: Array<Date>, arr2: Array<Date>) {
  return arr1.length === arr2.length && arr1.every((date, index) => date.getTime() === arr2[index].getTime())
}

export function modelToDate(model: ItemModel, viewDepth: Depth) {
  switch (viewDepth) {
    // 月视图，当前操作是选择天
    case Depth.Month: {
      return makeDate((model as DayModel).year, model.month, model.date)
    }
    // 年视图，当前操作是选择月
    case Depth.Year: {
      return makeDate((model as MonthModel).year, model.month, 1)
    }
    // 年代视图，当前操作是选择年
    case Depth.Decade: {
      return makeDate((model as YearModel).year, 0, 1)
    }
    default:
      throw new Error('never')
  }
}

export function dateToModel(dateObj: Date, depth: Depth): ItemModel {
  const year = dateObj.getUTCFullYear()
  const month = dateObj.getUTCMonth()
  const date = dateObj.getUTCDate()
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

/**
 * 从一个日期对象数组中，取出最接近今天的
 */
export function getClosestDate(dates: Date[] = []): Date | null {
  const now = Date.now()
  let offset = Infinity
  let result: Date | null = null
  for (let i = 0; i < dates.length; i += 1) {
    const current = dates[i]
    const currentOffset = Math.abs(current.getTime() - now)
    if (currentOffset < offset) {
      result = current
      offset = currentOffset
    }
  }
  return result
}

/**
 * 获取指定月份的第一天的日期对象
 */
function getFirstDate(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1, 0, 0, 0))
}

/**
 * 获取指定月份的最后一天日期对象
 */
function getLastDate(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0, 0, 0, 0))
}

/**
 * 获取指定月份的下个月的第一天日期对象
 */
function getFirstDateOfNextMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 1, 0, 0, 0))
}

/**
 * 获取指定月份的前一个月的最后一天日期对象
 */
function getLastDateOfPrevMonth(year: number, month: number) {
  return getLastDate(year, month - 1)
}
