import type { BaseDatePickerEventMap } from './base.js';
import type { BlComponentEventListener } from '../component/Component.js';
import { BaseDatePicker } from './base.js';
export interface BlDatePickerEventMap extends BaseDatePickerEventMap {
    change: CustomEvent<{
        value: Date[];
    }>;
    closed: CustomEvent;
    opened: CustomEvent;
}
export interface BlDatePicker extends BaseDatePicker {
    addEventListener<K extends keyof BlDatePickerEventMap>(type: K, listener: BlComponentEventListener<BlDatePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlDatePickerEventMap>(type: K, listener: BlComponentEventListener<BlDatePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlDatesPicker extends BaseDatePicker {
    static get observedAttributes(): string[];
    constructor();
    get mode(): 'multiple';
    get value(): Date[];
    set value(dates: Date[]);
}
