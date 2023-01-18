export declare function makeDate({ year, monthIndex, day, hour, minute, second, millisecond, }: {
    year?: number;
    monthIndex?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
}): Date;
export declare function makeDateFrom(type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond', date: Date): Date;
export declare function copyDate(date: Date): Date;
export declare function today(): Date;
export declare function compareDate(d1: Date, d2: Date, type?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'): 0 | 1 | -1;
