import type { BlButton } from '../button/index.js';
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import '../button/index.js';
import '../datetime/index.js';
import '../popup/index.js';
import '../select-result/index.js';
import { BlPopup } from '../popup/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { BlControl } from '../base-control/index.js';
import { BlDateTime } from '../datetime/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_RESULT_ACCESSORS } from '../../common/constants.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
interface BlDateTimePickerEventMap extends BlComponentEventMap {
    change: CustomEvent<{
        value: Date[];
    }>;
    closed: CustomEvent;
    opened: CustomEvent;
}
export interface BlDateTimePicker extends BlControl, Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>, Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
    $popup: BlPopup;
    $datetime: BlDateTime;
    $confirmButton: BlButton;
    addEventListener<K extends keyof BlDateTimePickerEventMap>(type: K, listener: BlComponentEventListener<BlDateTimePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlDateTimePickerEventMap>(type: K, listener: BlComponentEventListener<BlDateTimePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlDateTimePicker extends BlControl {
    #private;
    static get observedAttributes(): string[];
    accessor format: string;
    accessor open: boolean;
    accessor placeholder: string;
    accessor $content: HTMLElement;
    accessor $result: BlSelectResult;
    constructor();
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
    get value(): null | Date;
    set value(value: null | Date);
    _clickOutside: SetupClickOutside<this>;
}
export {};
