import type { BlComponentEventListener } from '../component/Component.js';
import type { BlControlBoxEventMap } from '../base-control-box/index.js';
import { BlControlBox } from '../base-control-box/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
declare const types: readonly ["primary", "danger", "warning", "success", "link"];
export interface BlButton extends BlControlBox {
    addEventListener<K extends keyof BlControlBoxEventMap>(type: K, listener: BlComponentEventListener<BlControlBoxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlControlBoxEventMap>(type: K, listener: BlComponentEventListener<BlControlBoxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlButton extends BlControlBox {
    #private;
    static get role(): string;
    accessor block: boolean;
    accessor outline: boolean;
    accessor type: OneOf<typeof types> | null;
    accessor size: MaybeOneOf<['small', 'large']> | null;
    accessor $content: HTMLSpanElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    _controlFeature: SetupControlEvent<this>;
    _emptyFeature: SetupEmpty<this>;
}
export {};
