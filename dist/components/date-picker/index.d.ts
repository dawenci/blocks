import type { BlocksButton } from '../button/index.js';
import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import type { EnumAttr } from '../../decorators/attr.js';
import { BlocksDate } from '../date/index.js';
import { BlocksSelectResult } from '../select-result/index.js';
import { BlocksPopup } from '../popup/index.js';
import { Control } from '../base-control/index.js';
interface DatePickerEventMap extends ComponentEventMap {
    change: CustomEvent<{
        value: any;
    }>;
    closed: CustomEvent;
    opened: CustomEvent;
}
export interface BlocksDatePicker extends Control {
    $popup: BlocksPopup;
    $date: BlocksDate;
    $confirmButton: BlocksButton;
    addEventListener<K extends keyof DatePickerEventMap>(type: K, listener: ComponentEventListener<DatePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof DatePickerEventMap>(type: K, listener: ComponentEventListener<DatePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksDatePicker extends Control {
    #private;
    static get observedAttributes(): string[];
    static get disableEventTypes(): readonly string[];
    accessor format: string;
    accessor open: boolean;
    accessor mode: EnumAttr<['single', 'multiple']>;
    accessor $result: BlocksSelectResult;
    constructor();
    get value(): Date | null;
    set value(value: Date | null);
    get values(): Date[];
    set values(values: Date[]);
    get disabledDate(): ((data: import("../date/type").ItemModel, context: {
        depth: import("../date/type").Depth;
        viewDepth: import("../date/type").Depth;
        component: BlocksDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: import("../date/type").ItemModel, context: {
        depth: import("../date/type").Depth;
        viewDepth: import("../date/type").Depth;
        component: BlocksDate;
    }) => boolean) | undefined);
}
export {};
