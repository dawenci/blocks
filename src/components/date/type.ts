export type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0

export interface DecadeModel {
  label: string
  century: number
  decade: number
  year: undefined
  month: undefined
  date: undefined
}
export interface YearModel {
  label: string
  century: number
  decade: number
  year: number
  month: undefined
  date: undefined
}
export interface MonthModel {
  label: string
  century: number
  decade: number
  year: number
  month: number
  date: undefined
}
export interface DayModel {
  label: string
  century: number
  decade: number
  year: number
  month: number
  date: number
}
export type ItemModel = DecadeModel | YearModel | MonthModel | DayModel
export type MaybeLeafModel = YearModel | MonthModel | DayModel
export type MaybeLeafDepth = Depth.Month | Depth.Year | Depth.Decade

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
