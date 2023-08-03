import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import { BlControl } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
export interface BlCheckboxEventMap extends BlComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
    'bl:checkbox:change': CustomEvent<{
        checked: boolean;
    }>;
}
export interface BlCheckbox extends BlControl {
    addEventListener<K extends keyof BlCheckboxEventMap>(type: K, listener: BlComponentEventListener<BlCheckboxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlCheckboxEventMap>(type: K, listener: BlComponentEventListener<BlCheckboxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlCheckbox extends BlControl {
    #private;
    static get role(): string;
    accessor name: string | null;
    accessor checked: boolean;
    accessor indeterminate: boolean;
    accessor $layout: HTMLDivElement;
    accessor $checkbox: HTMLSpanElement;
    accessor $label: HTMLLabelElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    _ariaFeature: import("../../common/Feature/Feature").Feature<this>;
    _controlFeature: SetupControlEvent<this>;
    _emptyFeature: SetupEmpty<this>;
}
