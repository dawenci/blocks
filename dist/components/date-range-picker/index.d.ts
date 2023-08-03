import type { BlComponentEventListener } from '../component/Component.js';
import '../pair-result/index.js';
import { BlDate } from '../date/index.js';
import { BlPairResult } from '../pair-result/index.js';
import { BlPopup } from '../popup/index.js';
import { BlControl, BlControlEventMap } from '../base-control/index.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export interface BlDateRangePickerEventMap extends BlControlEventMap {
    change: CustomEvent<{
        value: any;
    }>;
    closed: CustomEvent;
    opened: CustomEvent;
}
export interface BlDateRangePicker extends BlControl {
    $popup: BlPopup;
    $date: BlDate;
    addEventListener<K extends keyof BlDateRangePickerEventMap>(type: K, listener: BlComponentEventListener<BlDateRangePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlDateRangePickerEventMap>(type: K, listener: BlComponentEventListener<BlDateRangePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlDateRangePicker extends BlControl {
    #private;
    static get observedAttributes(): string[];
    accessor placeholderFirst: string;
    accessor placeholderSecond: string;
    accessor format: string;
    accessor open: boolean;
    accessor $result: BlPairResult;
    constructor();
    get value(): [Date | null, Date | null];
    set value(value: [Date | null, Date | null]);
    get disabledDate(): any;
    set disabledDate(value: any);
    _clickOutside: SetupClickOutside<this>;
}
