import { range } from '../../common/utils.js'

export type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0

export enum Depth {
  // 面板层级为月份，即可以选择 “日”
  Month = 'month',
  // 面板层级为年份，即可以选择 “月”
  Year = 'year',
  // 面板层级为年代，即可以选择“年”
  Decade = 'decade',
  // 面板层级为世纪，即可以选择“年代”
  Century = 'century',
}

export const Depths = [Depth.Month, Depth.Year, Depth.Decade, Depth.Century] as const

export const DepthValue = Object.freeze({
  [Depth.Century]: 0,
  [Depth.Decade]: 1,
  [Depth.Year]: 2,
  [Depth.Month]: 3,
})

/**
 * 获取指定月份的第一天的日期对象
 */
export function getFirstDate(year: number, month: number) {
  return new Date(year, month, 1)
}

/**
 * 获取指定月份的最后一天日期对象
 */
export function getLastDate(year: number, month: number) {
  return new Date(year, month + 1, 0)
}

/**
 * 获取指定月份的下个月的第一天日期对象
 */
export function getFirstDateOfNextMonth(year: number, month: number) {
  return new Date(year, month + 1, 1)
}

/**
 * 获取指定月份的前一个月的最后一天日期对象
 */
export function getLastDateOfPrevMonth(year: number, month: number) {
  return getLastDate(year, month - 1)
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
 * 规范最小的深度取值
 */
export function normalizeMinDepth(min: Depth, depth: Depth) {
  if (!min) return Depth.Century
  return DepthValue[depth] < DepthValue[min] ? depth : min
}

/**
 * 规范面板深度取值
 */
export function normalizeViewDepth(view: Depth, min: Depth, depth: Depth): Depth {
  if (!view) return depth as Depth
  if (DepthValue[view] < DepthValue[min]) {
    view = min
  }
  if (DepthValue[view] > DepthValue[depth]) {
    view = depth
  }
  return view as Depth
}

export type DateModel = {
  label: string
  century: number
  decade: number
  year: number
  month?: number
  date?: number
}

export function generateMonths(century: number, decade: number, year: number): DateModel[] {
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

// 生成日期列表（按月动态生成）
export function generateDates(
  century: number,
  decade: number,
  year: number,
  month: number,
  startWeekOn: number
): DateModel[] {
  if (year == null || month == null) return []

  // 该月的第一天
  const firstDate = getFirstDate(year, month)
  // 该月的最后一天
  const lastDate = getLastDate(year, month)
  // 该月的所有日
  const results = range(1, lastDate.getDate()).map(date => ({
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
    const prevYear = prevLastDate.getFullYear()
    const prevMonth = prevLastDate.getMonth()
    let date = prevLastDate.getDate()
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
  const nextYear = nextFirstDate.getFullYear()
  const nextMonth = nextFirstDate.getMonth()
  let date = nextFirstDate.getDate()
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

// 年份列表（10 年一组）
export function generateYears(century: number, decade: number): DateModel[] {
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
export function generateDecades(century: number): DateModel[] {
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
export function isToday(model: DateModel) {
  const today = new Date()
  return model.year === today.getFullYear() && model.month === today.getMonth() && model.date === today.getDate()
}

export function isAllEqual(arr1: Array<Date>, arr2: Array<Date>) {
  return arr1.length === arr2.length && arr1.every((date, index) => date.getTime() === arr2[index].getTime())
}
