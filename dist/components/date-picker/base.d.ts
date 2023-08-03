import type { BlButton } from '../button/index.js';
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import { BlDate } from '../date/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { BlPopup } from '../popup/index.js';
import { BlControl } from '../base-control/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_RESULT_ACCESSORS } from '../../common/constants.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export interface BaseDatePickerEventMap extends BlComponentEventMap {
    change: CustomEvent<{
        value: Date[] | Date | null;
    }>;
    closed: CustomEvent;
    opened: CustomEvent;
}
export interface BaseDatePicker extends BlControl, Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>, Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
    $popup: BlPopup;
    $date: BlDate;
    $confirmButton: BlButton;
    addEventListener<K extends keyof BaseDatePickerEventMap>(type: K, listener: BlComponentEventListener<BaseDatePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BaseDatePickerEventMap>(type: K, listener: BlComponentEventListener<BaseDatePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BaseDatePicker extends BlControl {
    #private;
    static get observedAttributes(): string[];
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor format: string;
    accessor open: boolean;
    accessor $result: BlSelectResult;
    protected _model: import("../../common/reactive.js").IReactive<Date[]>;
    constructor();
    get value(): Date[] | Date | null;
    set value(value: Date[] | Date | null);
    get disabledDate(): ((data: import("../date/type").ItemModel, context: {
        depth: import("../date/type").Depth;
        viewDepth: import("../date/type").Depth;
        component: BlDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: import("../date/type").ItemModel, context: {
        depth: import("../date/type").Depth;
        viewDepth: import("../date/type").Depth;
        component: BlDate;
    }) => boolean) | undefined);
    get mode(): 'single' | 'multiple';
    _clickOutside: SetupClickOutside<this>;
    protected _showLastValueInPanel(): void;
}
