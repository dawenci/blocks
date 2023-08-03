import { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import { BlControl } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
export interface SwitchEventMap extends BlComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
}
export interface BlSwitch extends BlControl {
    addEventListener<K extends keyof SwitchEventMap>(type: K, listener: BlComponentEventListener<SwitchEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SwitchEventMap>(type: K, listener: BlComponentEventListener<SwitchEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlSwitch extends BlControl {
    #private;
    static get role(): string;
    accessor checked: boolean;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor $layout: HTMLElement;
    constructor();
    _controlFeature: SetupControlEvent<this>;
}
