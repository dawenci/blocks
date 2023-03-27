import type { ComponentEventListener } from '../component/Component.js';
import type { MaybeLeafModel, ItemModel, MaybeLeafDepth } from './type.js';
import type { EnumAttr } from '../../decorators/attr.js';
import type { ISelectListEventMap, ISelected } from '../../common/connectSelectable.js';
import '../loading/index.js';
import { Control } from '../base-control/index.js';
import { Depth } from './type.js';
interface DateEventMap extends ISelectListEventMap {
    change: CustomEvent<{
        selected: Date[];
    }>;
    'panel-change': CustomEvent<{
        activeDepth: Depth;
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
    'active-depth-change': CustomEvent<{
        value: Depth;
    }>;
    'badges-change': CustomEvent<{
        value: Badge[];
    }>;
}
type Badge = {
    year: number;
    month?: number;
    date?: number;
    label?: string;
};
type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0;
export interface BlocksDate extends Control {
    addEventListener<K extends keyof DateEventMap>(type: K, listener: ComponentEventListener<DateEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof DateEventMap>(type: K, listener: ComponentEventListener<DateEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksDate extends Control {
    #private;
    static get observedAttributes(): string[];
    static get Depth(): typeof Depth;
    accessor loading: boolean;
    accessor max: number | null;
    accessor mode: EnumAttr<['single', 'multiple', 'range']>;
    accessor depth: MaybeLeafDepth;
    accessor minDepth: Depth;
    accessor startDepth: Depth;
    accessor startWeekOn: WeekNumber;
    accessor format: string;
    accessor $layout: HTMLElement;
    accessor $title: HTMLButtonElement;
    accessor $prevPrev: HTMLButtonElement;
    accessor $prev: HTMLButtonElement;
    accessor $nextNext: HTMLButtonElement;
    accessor $next: HTMLButtonElement;
    accessor $weekHeader: HTMLElement;
    accessor $content: HTMLElement;
    accessor $list: HTMLElement;
    accessor $loading: HTMLElement;
    constructor();
    get selected(): Date[];
    set selected(values: Date[]);
    get selectedCount(): number;
    get activeDepth(): Depth;
    set activeDepth(value: Depth);
    get activeCentury(): number | undefined;
    set activeCentury(value: number | undefined);
    get activeDecade(): number | undefined;
    set activeDecade(value: number | undefined);
    get activeYear(): number | undefined;
    set activeYear(value: number | undefined);
    get activeMonth(): number | undefined;
    set activeMonth(value: number | undefined);
    get rangeFrom(): MaybeLeafModel | null | undefined;
    set rangeFrom(value: MaybeLeafModel | null | undefined);
    get maybeRangeTo(): MaybeLeafModel | null | undefined;
    set maybeRangeTo(value: MaybeLeafModel | null | undefined);
    get rangeTo(): MaybeLeafModel | null | undefined;
    set rangeTo(value: MaybeLeafModel | null | undefined);
    get disabledDate(): ((data: ItemModel, context: {
        depth: Depth;
        viewDepth: Depth;
        component: BlocksDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: ItemModel, context: {
        depth: Depth;
        viewDepth: Depth;
        component: BlocksDate;
    }) => boolean) | undefined);
    get badges(): Badge[];
    set badges(value: Badge[]);
    clearUncompleteRange(): void;
    clearSelected(): void;
    deselect(selected: ISelected): void;
    notifySelectListChange(): void;
    selectByDate(date: Date): void;
    drillDown(itemModel: ItemModel): void;
    rollUp(): void;
    showItemModel(itemModel: ItemModel): void;
    showValue(dateObj: Date): void;
    showPrevMonth(): void;
    showNextMonth(): void;
    showPrevYear(): void;
    showNextYear(): void;
    showPrevDecade(): void;
    showNextDecade(): void;
    showPrevCentury(): void;
    showNextCentury(): void;
    dateEquals(a: Date, b: Date): boolean;
    getBadges(item: ItemModel): Badge[];
}
export {};
