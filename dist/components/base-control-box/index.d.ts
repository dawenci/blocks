import { Control } from '../base-control/index.js';
import { ComponentEventListener, ComponentEventMap } from '../Component.js';
export interface ControlBoxEventMap extends ComponentEventMap {
    'click-prefix-icon': CustomEvent;
    'click-suffix-icon': CustomEvent;
}
export interface ControlBox extends Control {
    _ref: {
        $layout: HTMLDivElement;
        $prefix?: HTMLElement;
        $suffix?: HTMLElement;
        $loading?: HTMLElement;
    };
    addEventListener<K extends keyof ControlBoxEventMap>(type: K, listener: ComponentEventListener<ControlBoxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ControlBoxEventMap>(type: K, listener: ComponentEventListener<ControlBoxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class ControlBox extends Control {
    accessor loading: boolean;
    accessor prefixIcon: string | null;
    accessor suffixIcon: string | null;
    constructor();
    _appendContent<T extends HTMLElement | DocumentFragment>($el: T): T;
    _renderLoading(): void;
    _renderPrefixIcon(): void;
    _renderSuffixIcon(): void;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
