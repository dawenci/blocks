import type { ComponentEventListener } from '../component/Component.js';
import type { ControlBoxEventMap } from '../base-control-box/index.js';
import { ControlBox } from '../base-control-box/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
export interface ClearableControlBoxEventMap extends ControlBoxEventMap {
    'click-clear': CustomEvent;
}
export interface ClearableControlBox extends ControlBox {
    addEventListener<K extends keyof ClearableControlBoxEventMap>(type: K, listener: ComponentEventListener<ClearableControlBoxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ClearableControlBoxEventMap>(type: K, listener: ComponentEventListener<ClearableControlBoxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class ClearableControlBox extends ControlBox {
    #private;
    accessor clearable: boolean;
    accessor $clear: HTMLButtonElement;
    constructor();
    _emptyFeature: SetupEmpty<this>;
    _renderClearable(): void;
    appendContent<T extends HTMLElement | DocumentFragment>($el: T): T;
    _renderSuffixIcon(): void;
}
