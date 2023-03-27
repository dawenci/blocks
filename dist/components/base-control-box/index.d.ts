import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import { Control } from '../base-control/index.js';
export interface ControlBoxEventMap extends ComponentEventMap {
    'click-prefix-icon': CustomEvent;
    'click-suffix-icon': CustomEvent;
}
export interface ControlBox extends Control {
    addEventListener<K extends keyof ControlBoxEventMap>(type: K, listener: ComponentEventListener<ControlBoxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ControlBoxEventMap>(type: K, listener: ComponentEventListener<ControlBoxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class ControlBox extends Control {
    #private;
    accessor loading: boolean;
    accessor prefixIcon: string | null;
    accessor suffixIcon: string | null;
    accessor $layout: HTMLDivElement;
    accessor $loading: HTMLSpanElement;
    accessor $prefix: HTMLSpanElement;
    accessor $suffix: HTMLSpanElement;
    constructor();
    appendContent<T extends HTMLElement | DocumentFragment>($el: T): T;
    _renderLoading(): void;
    _renderPrefixIcon(): void;
    _renderSuffixIcon(): void;
}
