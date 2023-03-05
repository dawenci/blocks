import { ComponentEventListener, ComponentEventMap } from '../Component.js';
import { Control } from '../base-control/index.js';
import type { EnumAttrs } from '../../decorators/attr.js';
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
    static get observedAttributes(): string[];
    static get role(): string;
    accessor checked: boolean;
    accessor size: EnumAttrs['size'];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
