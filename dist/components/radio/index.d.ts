import { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import { Control } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
interface RadioEventMap extends ComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
}
export interface BlocksRadio extends Control {
    addEventListener<K extends keyof RadioEventMap>(type: K, listener: ComponentEventListener<RadioEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RadioEventMap>(type: K, listener: ComponentEventListener<RadioEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksRadio extends Control {
    #private;
    static get role(): string;
    static get disableEventTypes(): string[];
    accessor name: string;
    accessor checked: boolean;
    accessor $layout: HTMLElement;
    accessor $radio: HTMLElement;
    accessor $label: HTMLLabelElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    _controlFeature: SetupControlEvent<this>;
    _emptyFeature: SetupEmpty<this>;
}
export {};
