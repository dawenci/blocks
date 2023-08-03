import type { BlComponentEventListener } from '../component/Component.js';
import type { BlTimeEventMap, ValueField } from '../time/index.js';
import type { TimeModel } from '../time/index.js';
import '../input/index.js';
import '../select-result/index.js';
import '../popup/index.js';
import '../time/index.js';
import { BlControl } from '../base-control/index.js';
import { BlPopup } from '../popup/index.js';
import { BlTime } from '../time/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_RESULT_ACCESSORS } from '../../common/constants.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export interface BlTimePickerEventMap extends BlTimeEventMap {
    change: CustomEvent<{
        value: TimeModel | null;
    }>;
}
export interface BlTimePicker extends BlControl, Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>, Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
    $popup: BlPopup;
    $time: BlTime;
    addEventListener<K extends keyof BlTimePickerEventMap>(type: K, listener: BlComponentEventListener<BlTimePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlTimePickerEventMap>(type: K, listener: BlComponentEventListener<BlTimePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlTimePicker extends BlControl {
    #private;
    static get observedAttributes(): string[];
    accessor open: boolean;
    accessor hour: number | null;
    accessor minute: number | null;
    accessor second: number | null;
    accessor $result: BlSelectResult;
    constructor();
    get value(): TimeModel | null;
    set value(value: TimeModel | null);
    get disabledTime(): ((hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]) | undefined;
    set disabledTime(value: ((hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]) | undefined);
    isDisabled(field: ValueField, value: number): boolean;
    firstEnableModel(fixHour?: number, fixMinute?: number, fixSecond?: number): TimeModel | null;
    _clickOutside: SetupClickOutside<this>;
    _confirm(): void;
}
