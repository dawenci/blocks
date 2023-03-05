export type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0;
export declare enum Depth {
    Month = "month",
    Year = "year",
    Decade = "decade",
    Century = "century"
}
export declare const Depths: readonly [Depth.Month, Depth.Year, Depth.Decade, Depth.Century];
export declare const DepthValue: Readonly<{
    century: 0;
    decade: 1;
    year: 2;
    month: 3;
}>;
export declare function getFirstDate(year: number, month: number): Date;
export declare function getLastDate(year: number, month: number): Date;
export declare function getFirstDateOfNextMonth(year: number, month: number): Date;
export declare function getLastDateOfPrevMonth(year: number, month: number): Date;
export declare function getClosestDate(dates?: Date[]): Date | null;
export declare function normalizeMinDepth(min: Depth, depth: Depth): Depth;
export declare function normalizeViewDepth(view: Depth, min: Depth, depth: Depth): Depth;
export type DateModel = {
    label: string;
    century: number;
    decade: number;
    year: number;
    month?: number;
    date?: number;
};
export declare function generateMonths(century: number, decade: number, year: number): DateModel[];
export declare function generateDates(century: number, decade: number, year: number, month: number, startWeekOn: number): DateModel[];
export declare function generateYears(century: number, decade: number): DateModel[];
export declare function generateDecades(century: number): DateModel[];
export declare function makeDate(year: number, month?: number, date?: number): Date;
export declare function normalizeNumber(value: any): number | null;
export declare function yearToDecade(year: number): number;
export declare function yearToCentury(year: number): number;
export declare function decadeToCentury(decade: number): number;
export declare function isYearInDecade(year: number, decade: number): boolean;
export declare function isYearInCentury(year: number, century: number): boolean;
export declare function firstYearOfDecade(decade: number): number;
export declare function lastYearOfDecade(decade: number): number;
export declare function firstYearOfCentury(century: number): number;
export declare function lastYearOfCentury(century: number): number;
export declare function generateWeekHeaders(startWeekOn: WeekNumber): string[];
export declare function isToday(model: DateModel): boolean;
export declare function isAllEqual(arr1: Array<Date>, arr2: Array<Date>): boolean;
