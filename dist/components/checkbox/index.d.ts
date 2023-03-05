import { ComponentEventListener, ComponentEventMap } from '../Component.js';
import { Control } from '../base-control/index.js';
interface CheckboxEventMap extends ComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
    'bl:checkbox:change': CustomEvent<{
        checked: boolean;
    }>;
}
export interface BlocksCheckbox extends Control {
    _ref: Control['_ref'] & {
        $checkbox: HTMLSpanElement;
        $label: HTMLLabelElement;
        $slot: HTMLSlotElement;
    };
    addEventListener<K extends keyof CheckboxEventMap>(type: K, listener: ComponentEventListener<CheckboxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof CheckboxEventMap>(type: K, listener: ComponentEventListener<CheckboxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksCheckbox extends Control {
    static get observedAttributes(): string[];
    static get role(): string;
    accessor name: string | null;
    accessor checked: boolean;
    accessor indeterminate: boolean;
    constructor();
    _renderIndeterminate(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
