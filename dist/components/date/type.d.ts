export type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0;
export interface DecadeModel {
    label: string;
    century: number;
    decade: number;
    year: undefined;
    month: undefined;
    date: undefined;
}
export interface YearModel {
    label: string;
    century: number;
    decade: number;
    year: number;
    month: undefined;
    date: undefined;
}
export interface MonthModel {
    label: string;
    century: number;
    decade: number;
    year: number;
    month: number;
    date: undefined;
}
export interface DayModel {
    label: string;
    century: number;
    decade: number;
    year: number;
    month: number;
    date: number;
}
export type ItemModel = DecadeModel | YearModel | MonthModel | DayModel;
export type MaybeLeafModel = YearModel | MonthModel | DayModel;
export type MaybeLeafDepth = Depth.Month | Depth.Year | Depth.Decade;
export declare enum Depth {
    Month = "month",
    Year = "year",
    Decade = "decade",
    Century = "century"
}
export declare const Depths: readonly [Depth.Month, Depth.Year, Depth.Decade, Depth.Century];
