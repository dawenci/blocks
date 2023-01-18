import { ComponentEventListener, ComponentEventMap } from '../Component.js';
import { Control } from '../base-control/index.js';
export interface SwitchEventMap extends ComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
}
export declare class BlocksSwitch extends Control {
    static get role(): string;
    constructor();
    get checked(): boolean;
    set checked(value: boolean);
    get size(): "small" | "large" | null;
    set size(value: "small" | "large" | null);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    addEventListener<K extends keyof SwitchEventMap>(type: K, listener: ComponentEventListener<SwitchEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SwitchEventMap>(type: K, listener: ComponentEventListener<SwitchEventMap[K]>, options?: boolean | EventListenerOptions): void;
    static get observedAttributes(): string[];
}
