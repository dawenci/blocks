import { ComponentEventListener, ComponentEventMap } from '../Component.js';
import { Control } from '../base-control/index.js';
interface RadioEventMap extends ComponentEventMap {
    change: CustomEvent<{
        checked: boolean;
    }>;
}
interface BlocksRadio extends Control {
    _ref: Control['_ref'] & {
        $radio: HTMLElement;
        $label: HTMLLabelElement;
        $slot: HTMLSlotElement;
    };
}
declare class BlocksRadio extends Control {
    static get role(): string;
    static get observedAttributes(): string[];
    constructor();
    get name(): string | null;
    set name(value: string | null);
    get checked(): boolean;
    set checked(value: boolean);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    addEventListener<K extends keyof RadioEventMap>(type: K, listener: ComponentEventListener<RadioEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RadioEventMap>(type: K, listener: ComponentEventListener<RadioEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export { BlocksRadio };
