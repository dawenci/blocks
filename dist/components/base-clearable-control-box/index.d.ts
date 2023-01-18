import { ComponentEventListener } from '../Component.js';
import { ControlBox, ControlBoxEventMap } from '../base-control-box/index.js';
export interface ClearableControlBoxEventMap extends ControlBoxEventMap {
    'click-clear': CustomEvent;
}
export interface ClearableControlBox extends ControlBox {
    _ref: ControlBox['_ref'] & {
        $clear?: HTMLButtonElement;
    };
    addEventListener<K extends keyof ClearableControlBoxEventMap>(type: K, listener: ComponentEventListener<ClearableControlBoxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ClearableControlBoxEventMap>(type: K, listener: ComponentEventListener<ClearableControlBoxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare abstract class ClearableControlBox extends ControlBox {
    static get observedAttributes(): string[];
    constructor();
    get clearable(): boolean;
    set clearable(value: boolean);
    _isEmpty(): boolean;
    _appendContent<T extends HTMLElement | DocumentFragment>($el: T): T;
    _renderSuffixIcon(): void;
    _renderEmpty(): void;
    _renderClearable(): void;
    render(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
