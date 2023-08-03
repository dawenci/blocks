import { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import { BlControl } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
interface RadioEventMap extends BlComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
}
export interface BlRadio extends BlControl {
    addEventListener<K extends keyof RadioEventMap>(type: K, listener: BlComponentEventListener<RadioEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RadioEventMap>(type: K, listener: BlComponentEventListener<RadioEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlRadio extends BlControl {
    #private;
    static get role(): string;
    accessor name: string;
    accessor checked: boolean;
    accessor $layout: HTMLElement;
    accessor $radio: HTMLElement;
    accessor $label: HTMLLabelElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    _ariaFeature: import("../../common/Feature/Feature").Feature<this>;
    _controlFeature: SetupControlEvent<this>;
    _emptyFeature: SetupEmpty<this>;
}
export {};
