import type { BlCloseButton } from '../close-button/index.js';
import type { BlComponentEventListener } from '../component/Component.js';
import type { BlControlBoxEventMap } from '../base-control-box/index.js';
import '../close-button/index.js';
import { BlControlBox } from '../base-control-box/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
export interface BlClearableControlBoxEventMap extends BlControlBoxEventMap {
    'click-clear': CustomEvent;
}
export interface BlClearableControlBox extends BlControlBox {
    addEventListener<K extends keyof BlClearableControlBoxEventMap>(type: K, listener: BlComponentEventListener<BlClearableControlBoxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlClearableControlBoxEventMap>(type: K, listener: BlComponentEventListener<BlClearableControlBoxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlClearableControlBox extends BlControlBox {
    #private;
    accessor clearable: boolean;
    accessor $clear: BlCloseButton;
    constructor();
    _emptyFeature: SetupEmpty<this>;
    appendContent<T extends HTMLElement | DocumentFragment>($el: T): T;
    _renderSuffixIcon(): void;
}
