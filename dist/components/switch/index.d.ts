import type { EnumAttrs } from '../../decorators/attr.js';
import { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import { Control } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
export interface SwitchEventMap extends ComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
}
export interface BlocksSwitch extends Control {
    addEventListener<K extends keyof SwitchEventMap>(type: K, listener: ComponentEventListener<SwitchEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SwitchEventMap>(type: K, listener: ComponentEventListener<SwitchEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksSwitch extends Control {
    #private;
    static get role(): string;
    static get disableEventTypes(): readonly string[];
    accessor checked: boolean;
    accessor size: EnumAttrs['size'];
    accessor $layout: HTMLElement;
    constructor();
    _controlFeature: SetupControlEvent<this>;
}
