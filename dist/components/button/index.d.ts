import type { ComponentEventListener } from '../component/Component.js';
import type { ControlBoxEventMap } from '../base-control-box/index.js';
import type { EnumAttr, EnumAttrs } from '../../decorators/attr.js';
import { ControlBox } from '../base-control-box/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
declare const types: readonly ["primary", "danger", "warning", "success", "link"];
export interface BlocksButton extends ControlBox {
    addEventListener<K extends keyof ControlBoxEventMap>(type: K, listener: ComponentEventListener<ControlBoxEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ControlBoxEventMap>(type: K, listener: ComponentEventListener<ControlBoxEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksButton extends ControlBox {
    #private;
    static get role(): string;
    static get disableEventTypes(): string[];
    accessor block: boolean;
    accessor outline: boolean;
    accessor type: EnumAttr<typeof types> | null;
    accessor size: EnumAttrs['size'] | null;
    accessor $content: HTMLSpanElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    _controlFeature: SetupControlEvent<this>;
    _emptyFeature: SetupEmpty<this>;
}
export {};
