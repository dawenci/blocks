import type { BlComponentEventListener } from '../component/Component.js';
import type { ISelectListEventMap, ISelectableListComponent, ISelected } from '../../common/connectSelectable.js';
import '../loading/index.js';
import { BlControl } from '../base-control/index.js';
import { BlDate } from '../date/index.js';
import { BlTime } from '../time/index.js';
import { Depth, WeekNumber } from '../date/type.js';
export interface BlDateTimeEventMap extends ISelectListEventMap<Date> {
    change: CustomEvent<{
        value: Date | null;
    }>;
}
export interface BlDateTime extends BlControl, ISelectableListComponent {
    addEventListener<K extends keyof BlDateTimeEventMap>(type: K, listener: BlComponentEventListener<BlDateTimeEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlDateTimeEventMap>(type: K, listener: BlComponentEventListener<BlDateTimeEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare const dateTimeEquals: (a: Date | null, b: Date | null) => boolean;
export declare class BlDateTime extends BlControl implements ISelectableListComponent {
    #private;
    static get observedAttributes(): string[];
    accessor format: string;
    accessor timeFormat: string;
    accessor minDepth: Depth;
    accessor startDepth: Depth;
    accessor startWeekOn: WeekNumber;
    accessor $date: BlDate;
    accessor $time: BlTime;
    accessor $timeValue: HTMLElement;
    formatter: import("../../common/reactive.js").IReactive<(date: Date) => string>;
    timeFormatter: import("../../common/reactive.js").IReactive<(date: Date) => string>;
    constructor();
    get selected(): Date | null;
    set selected(date: Date | null);
    get disabledDate(): ((data: import("../date/type.js").ItemModel, context: {
        depth: Depth;
        viewDepth: Depth;
        component: BlDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: import("../date/type.js").ItemModel, context: {
        depth: Depth;
        viewDepth: Depth;
        component: BlDate;
    }) => boolean) | undefined);
    get disabledTime(): ((hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]) | undefined;
    set disabledTime(value: ((hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]) | undefined);
    defaultDate(): Date;
    clearSelected(): void;
    deselect(selected: ISelected): void;
    dateTimeEquals(a: Date, b: Date): boolean;
    showValue(date: Date): void;
    scrollToActive(): void;
}
