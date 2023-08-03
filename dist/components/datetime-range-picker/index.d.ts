import type { BlButton } from '../button/index.js';
import type { BlComponentEventListener } from '../component/Component.js';
import '../button/index.js';
import '../datetime/index.js';
import '../pair-result/index.js';
import '../popup/index.js';
import { BlControl, BlControlEventMap } from '../base-control/index.js';
import { BlDateTime } from '../datetime/index.js';
import { BlPopup } from '../popup/index.js';
import { BlPairResult } from '../pair-result/index.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export interface BlDateTimeRangePickerEventMap extends BlControlEventMap {
    change: CustomEvent<{
        value: [Date | null, Date | null];
    }>;
    closed: CustomEvent;
    opened: CustomEvent;
}
export interface BlDateTimeRangePicker extends BlControl {
    $popup: BlPopup;
    $datetime: BlDateTime;
    $confirmButton: BlButton;
    addEventListener<K extends keyof BlDateTimeRangePickerEventMap>(type: K, listener: BlComponentEventListener<BlDateTimeRangePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlDateTimeRangePickerEventMap>(type: K, listener: BlComponentEventListener<BlDateTimeRangePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlDateTimeRangePicker extends BlControl {
    #private;
    static get observedAttributes(): string[];
    accessor open: boolean;
    accessor placeholderFirst: string;
    accessor placeholderSecond: string;
    accessor format: string;
    accessor $result: BlPairResult;
    constructor();
    get value(): [Date | null, Date | null];
    set value(value: [Date | null, Date | null]);
    get disabledDate(): ((data: import("../date/type").ItemModel, context: {
        depth: import("../date/type").Depth;
        viewDepth: import("../date/type").Depth;
        component: import("../date/index").BlDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: import("../date/type").ItemModel, context: {
        depth: import("../date/type").Depth;
        viewDepth: import("../date/type").Depth;
        component: import("../date/index").BlDate;
    }) => boolean) | undefined);
    get disabledTime(): ((hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]) | undefined;
    set disabledTime(value: ((hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]) | undefined);
    _clickOutside: SetupClickOutside<this>;
}
