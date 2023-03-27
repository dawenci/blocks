import type { ComponentEventListener } from '../component/Component.js';
import { IPairSelectResultEventMap } from '../../common/connectSelectable.js';
import '../pair-result/index.js';
import { BlocksDate } from '../date/index.js';
import { BlocksPairResult } from '../pair-result/index.js';
import { BlocksPopup } from '../popup/index.js';
import { Control } from '../base-control/index.js';
interface DatePickerEventMap extends IPairSelectResultEventMap {
    change: CustomEvent<{
        value: any;
    }>;
    closed: CustomEvent;
    opened: CustomEvent;
}
export interface BlocksDateRangePicker extends Control {
    $popup: BlocksPopup;
    $date: BlocksDate;
    addEventListener<K extends keyof DatePickerEventMap>(type: K, listener: ComponentEventListener<DatePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof DatePickerEventMap>(type: K, listener: ComponentEventListener<DatePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksDateRangePicker extends Control {
    #private;
    static get observedAttributes(): string[];
    static get disableEventTypes(): readonly string[];
    accessor placeholderFrom: string;
    accessor placeholderTo: string;
    accessor format: string;
    accessor open: boolean;
    accessor $result: BlocksPairResult;
    constructor();
    get value(): Date;
    set value(value: Date);
    get disabledDate(): any;
    set disabledDate(value: any);
    connectResult(): void;
    disconnectResult(): void;
}
export {};
