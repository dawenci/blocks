import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import { BlControl } from '../base-control/index.js';
export interface BlControlBoxEventMap extends BlComponentEventMap {
    'click-prefix-icon': CustomEvent;
    'click-suffix-icon': CustomEvent;
}
export interface BlControlBox extends BlControl {
    addEventListener<K extends keyof BlControlBoxEventMap>(type: K, listener: BlComponentEventListener<BlControlBoxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlControlBoxEventMap>(type: K, listener: BlComponentEventListener<BlControlBoxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlControlBox extends BlControl {
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
