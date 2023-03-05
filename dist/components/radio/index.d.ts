import { ComponentEventListener, ComponentEventMap } from '../Component.js';
import { Control } from '../base-control/index.js';
interface RadioEventMap extends ComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
}
export interface BlocksRadio extends Control {
    _ref: Control['_ref'] & {
        $radio: HTMLElement;
        $label: HTMLLabelElement;
        $slot: HTMLSlotElement;
    };
    addEventListener<K extends keyof RadioEventMap>(type: K, listener: ComponentEventListener<RadioEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RadioEventMap>(type: K, listener: ComponentEventListener<RadioEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksRadio extends Control {
    static get role(): string;
    static get observedAttributes(): string[];
    accessor name: string;
    accessor checked: boolean;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
