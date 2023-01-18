import { range } from '../../common/utils.js';
export var Depth;
(function (Depth) {
    Depth["Month"] = "month";
    Depth["Year"] = "year";
    Depth["Decade"] = "decade";
    Depth["Century"] = "century";
})(Depth || (Depth = {}));
export const Depths = [
    Depth.Month,
    Depth.Year,
    Depth.Decade,
    Depth.Century,
];
export const DepthValue = Object.freeze({
    [Depth.Century]: 0,
    [Depth.Decade]: 1,
    [Depth.Year]: 2,
    [Depth.Month]: 3,
});
export function getFirstDate(year, month) {
    return new Date(year, month, 1);
}
export function getLastDate(year, month) {
    return new Date(year, month + 1, 0);
}
export function getFirstDateOfNextMonth(year, month) {
    return new Date(year, month + 1, 1);
}
export function getLastDateOfPrevMonth(year, month) {
    return getLastDate(year, month - 1);
}
export function getClosestDate(dates = []) {
    const now = Date.now();
    let offset = Infinity;
    let result = null;
    for (let i = 0; i < dates.length; i += 1) {
        const current = dates[i];
        const currentOffset = Math.abs(current.getTime() - now);
        if (currentOffset < offset) {
            result = current;
            offset = currentOffset;
        }
    }
    return result;
}
export function normalizeMinDepth(min, depth) {
    if (!min)
        return Depth.Century;
    return DepthValue[depth] < DepthValue[min] ? depth : min;
}
export function normalizeViewDepth(view, min, depth) {
    if (!view)
        return depth;
    if (DepthValue[view] < DepthValue[min]) {
        view = min;
    }
    if (DepthValue[view] > DepthValue[depth]) {
        view = depth;
    }
    return view;
}
export function generateMonths(century, decade, year) {
    const results = range(0, 11).map(month => ({
        label: String(month + 1),
        century,
        decade,
        year,
        month,
        date: undefined,
    }));
    return results;
}
export function generateDates(century, decade, year, month, startWeekOn) {
    if (year == null || month == null)
        return [];
    const firstDate = getFirstDate(year, month);
    const lastDate = getLastDate(year, month);
    const results = range(1, lastDate.getDate()).map(date => ({
        label: String(date),
        century,
        decade,
        year,
        month,
        date,
    }));
    const firstDateIndex = firstDate.getDay();
    if (firstDateIndex !== startWeekOn) {
        const prevLastDate = getLastDateOfPrevMonth(year, month);
        const prevYear = prevLastDate.getFullYear();
        const prevMonth = prevLastDate.getMonth();
        let date = prevLastDate.getDate();
        let n = (7 + firstDateIndex - startWeekOn) % 7;
        while (n--) {
            results.unshift({
                label: String(date),
                century: Math.floor(prevYear / 100),
                decade: Math.floor(prevYear / 10),
                year: prevYear,
                month: prevMonth,
                date: date,
            });
            date--;
        }
    }
    const nextFirstDate = getFirstDateOfNextMonth(year, month);
    const nextYear = nextFirstDate.getFullYear();
    const nextMonth = nextFirstDate.getMonth();
    let date = nextFirstDate.getDate();
    while (results.length < 42) {
        results.push({
            label: String(date),
            century: Math.floor(nextYear / 100),
            decade: Math.floor(nextYear / 10),
            year: nextYear,
            month: nextMonth,
            date: date,
        });
        date++;
    }
    return results;
}
export function generateYears(century, decade) {
    const from = decade * 10;
    const to = from + 9;
    return range(from, to).map(year => ({
        label: String(year),
        century,
        decade,
        year,
        month: undefined,
        date: undefined,
    }));
}
export function generateDecades(century) {
    const decadeFrom = century * 10;
    const decadeTo = decadeFrom + 9;
    const list = [];
    for (let decade = decadeFrom; decade <= decadeTo; decade += 1) {
        list.push({
            label: `${decade * 10} ~ ${decade * 10 + 9}`,
            century,
            decade,
            year: undefined,
            month: undefined,
            date: undefined,
        });
    }
    return list;
}
export function makeDate(year, month, date) {
    const d = new Date(Date.UTC(year, month ?? 0, date ?? 1, 0, 0, 0, 0));
    d.setUTCFullYear(year);
    return d;
}
export function normalizeNumber(value) {
    if (typeof value === 'number' && !Object.is(value, NaN)) {
        return Math.trunc(value);
    }
    value = parseInt(String(value), 10);
    return Object.is(value, NaN) ? null : value;
}
export function yearToDecade(year) {
    return Math.floor(year / 10);
}
export function yearToCentury(year) {
    return Math.floor(year / 100);
}
export function decadeToCentury(decade) {
    return decade / 10;
}
export function isYearInDecade(year, decade) {
    return yearToDecade(year) == decade;
}
export function isYearInCentury(year, century) {
    return yearToCentury(year) === century;
}
export function firstYearOfDecade(decade) {
    return decade * 10;
}
export function lastYearOfDecade(decade) {
    return decade * 10 + 9;
}
export function firstYearOfCentury(century) {
    return century * 100;
}
export function lastYearOfCentury(century) {
    return century * 100 + 99;
}
export function generateWeekHeaders(startWeekOn) {
    const headers = ['日', '一', '二', '三', '四', '五', '六'];
    return headers.slice(startWeekOn).concat(headers.slice(0, startWeekOn));
}
export function isToday(model) {
    const today = new Date();
    return (model.year === today.getFullYear() &&
        model.month === today.getMonth() &&
        model.date === today.getDate());
}
export function isAllEqual(arr1, arr2) {
    return (arr1.length === arr2.length &&
        arr1.every((date, index) => date.getTime() === arr2[index].getTime()));
}
