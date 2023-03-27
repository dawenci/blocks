import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import { Control } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
interface CheckboxEventMap extends ComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
    'bl:checkbox:change': CustomEvent<{
        checked: boolean;
    }>;
}
export interface BlocksCheckbox extends Control {
    addEventListener<K extends keyof CheckboxEventMap>(type: K, listener: ComponentEventListener<CheckboxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof CheckboxEventMap>(type: K, listener: ComponentEventListener<CheckboxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksCheckbox extends Control {
    #private;
    static get role(): string;
    static get disableEventTypes(): string[];
    accessor name: string | null;
    accessor checked: boolean;
    accessor indeterminate: boolean;
    accessor $layout: HTMLDivElement;
    accessor $checkbox: HTMLSpanElement;
    accessor $label: HTMLLabelElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    _controlFeature: SetupControlEvent<this>;
    _emptyFeature: SetupEmpty<this>;
}
export {};
