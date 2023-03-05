import '../loading/index.js';
import { DateModel, Depth } from './helpers.js';
import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
import type { EnumAttr } from '../../decorators/attr.js';
interface DateEventMap extends ComponentEventMap {
    select: CustomEvent<{
        value: Date[] | [Date, Date] | null;
    }>;
    change: CustomEvent<{
        value: Date[] | [Date, Date] | null;
    }>;
    'panel-change': CustomEvent<{
        viewDepth: Depth;
    }>;
    'prev-month': CustomEvent<{
        century: number;
        decade: number;
        year: number;
        month: number;
    }>;
    'next-month': CustomEvent<{
        century: number;
        decade: number;
        year: number;
        month: number;
    }>;
    'prev-year': CustomEvent<{
        century: number;
        decade: number;
        year: number;
    }>;
    'next-year': CustomEvent<{
        century: number;
        decade: number;
        year: number;
    }>;
    'prev-decade': CustomEvent<{
        century: number;
        decade: number;
    }>;
    'next-decade': CustomEvent<{
        century: number;
        decade: number;
    }>;
    'prev-century': CustomEvent<{
        century: number;
    }>;
    'next-century': CustomEvent<{
        century: number;
    }>;
}
type Badge = {
    year: number;
    month?: number;
    date?: number;
    label?: string;
};
type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0;
export interface BlocksDate extends Component {
    _ref: {
        $panel: HTMLElement;
        $title: HTMLButtonElement;
        $prevPrev: HTMLButtonElement;
        $prev: HTMLButtonElement;
        $nextNext: HTMLButtonElement;
        $next: HTMLButtonElement;
        $weekHeader: HTMLElement;
        $content: HTMLElement;
        $list: HTMLElement;
        $loading: HTMLElement;
    };
    addEventListener<K extends keyof DateEventMap>(type: K, listener: ComponentEventListener<DateEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof DateEventMap>(type: K, listener: ComponentEventListener<DateEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksDate extends Component {
    #private;
    constructor();
    get rangeFrom(): DateModel | null | undefined;
    set rangeFrom(value: DateModel | null | undefined);
    maybeRangeTo?: DateModel | null;
    get rangeTo(): DateModel | null | undefined;
    set rangeTo(value: DateModel | null | undefined);
    get disabledDate(): ((data: DateModel, context: {
        depth: Depth;
        viewDepth: Depth;
        component: BlocksDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: DateModel, context: {
        depth: Depth;
        viewDepth: Depth;
        component: BlocksDate;
    }) => boolean) | undefined);
    accessor disabled: boolean;
    accessor loading: boolean;
    accessor max: number | null;
    accessor mode: EnumAttr<['single', 'multiple', 'range']>;
    accessor depth: EnumAttr<[Depth.Month, Depth.Year, Depth.Decade]>;
    get mindepth(): Depth;
    set mindepth(value: Depth);
    get startdepth(): Depth;
    set startdepth(value: Depth);
    get badges(): Badge[];
    set badges(value: Badge[]);
    get startWeekOn(): WeekNumber;
    set startWeekOn(value: WeekNumber);
    get multiple(): boolean;
    get viewDepth(): Depth;
    set viewDepth(value: Depth);
    get viewCentury(): number;
    set viewCentury(value: number);
    get viewDecade(): number;
    set viewDecade(value: number);
    get viewYear(): number;
    set viewYear(value: number);
    get viewMonth(): number | undefined;
    set viewMonth(value: number | undefined);
    get value(): Date | Date[] | null;
    set value(value: Date | Date[] | null);
    clearUncompleteRange(): void;
    clearValue(): void;
    getValue(): Date | null;
    setValue(value: Date | null): void;
    getRange(): [Date, Date] | null;
    setRange(value: [Date, Date] | null): void;
    getValues(): Date[];
    setValues(values: Date[]): void;
    isRangeMode(): boolean;
    getDecadeRange(decade: number): [number, number];
    limitReached(): boolean;
    switchViewByDate(date: Date): void;
    render(): void;
    getBadges(item: DateModel): Badge[];
    selectDate(date: Date): void;
    selectByModel(item: DateModel): void;
    drillDown(item: DateModel): void;
    rollUp(): void;
    showPrevMonth(): void;
    showNextMonth(): void;
    showPrevYear(): void;
    showNextYear(): void;
    showPrevDecade(): void;
    showNextDecade(): void;
    showPrevCentury(): void;
    showNextCentury(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    static get Depth(): typeof Depth;
    static get observedAttributes(): string[];
}
export {};
