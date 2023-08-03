export function makeDate({ year, monthIndex, day, hour, minute, second, millisecond, }) {
    const d = new Date(Date.UTC(year ?? 0, monthIndex ?? 0, day ?? 1, hour ?? 0, minute ?? 0, second ?? 0, millisecond ?? 0));
    if (year) {
        d.setUTCFullYear(year);
    }
    return d;
}
export function makeDateFrom(type, date) {
    switch (type) {
        case 'year':
            return makeDate({ year: date.getUTCFullYear() });
        case 'month':
            return makeDate({ year: date.getUTCFullYear(), monthIndex: date.getUTCMonth() });
        case 'day':
            return makeDate({
                year: date.getUTCFullYear(),
                monthIndex: date.getUTCMonth(),
                day: date.getUTCDate(),
            });
        case 'hour':
            return makeDate({
                year: date.getUTCFullYear(),
                monthIndex: date.getUTCMonth(),
                day: date.getUTCDate(),
                hour: date.getUTCHours(),
            });
        case 'minute':
            return makeDate({
                year: date.getUTCFullYear(),
                monthIndex: date.getUTCMonth(),
                day: date.getUTCDate(),
                hour: date.getUTCHours(),
                minute: date.getUTCMinutes(),
            });
        case 'second':
            return makeDate({
                year: date.getUTCFullYear(),
                monthIndex: date.getUTCMonth(),
                day: date.getUTCDate(),
                hour: date.getUTCHours(),
                minute: date.getUTCMinutes(),
                second: date.getUTCSeconds(),
            });
        case 'millisecond':
            return makeDate({
                year: date.getUTCFullYear(),
                monthIndex: date.getUTCMonth(),
                day: date.getUTCDate(),
                hour: date.getUTCHours(),
                minute: date.getUTCMinutes(),
                second: date.getUTCSeconds(),
                millisecond: date.getUTCMilliseconds(),
            });
    }
}
export function copyDate(date) {
    const copy = new Date();
    copy.setTime(date.getTime());
    return copy;
}
export function today() {
    const date = new Date();
    return makeDate({
        year: date.getUTCFullYear(),
        monthIndex: date.getUTCMonth(),
        day: date.getUTCDate(),
    });
}
export function compareDate(d1, d2, type) {
    type = type ?? 'millisecond';
    const t1 = makeDateFrom(type, d1).getTime();
    const t2 = makeDateFrom(type, d2).getTime();
    if (t1 === t2)
        return 0;
    if (t1 < t2)
        return -1;
    return 1;
}
