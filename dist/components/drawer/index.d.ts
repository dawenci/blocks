import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import '../close-button/index.js';
import '../icon/index.js';
import '../modal-mask/index.js';
import { BlModalMask } from '../modal-mask/index.js';
import { BlPopup } from '../popup/index.js';
import { BlComponentEventListener } from '../component/Component.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export type BlDrawerEventMap = WithOpenTransitionEventMap;
export interface BlDrawer extends BlPopup {
    $mask: BlModalMask | null;
    addEventListener<K extends keyof BlDrawerEventMap>(type: K, listener: BlComponentEventListener<BlDrawerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlDrawerEventMap>(type: K, listener: BlComponentEventListener<BlDrawerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlDrawer extends BlPopup {
    #private;
    static get role(): string;
    accessor closeOnClickMask: boolean;
    accessor closeOnClickOutside: boolean;
    accessor closeOnPressEscape: boolean;
    accessor mask: boolean;
    accessor closeable: boolean;
    accessor titleText: string;
    accessor size: string;
    accessor placement: OneOf<['right', 'left', 'bottom', 'top']>;
    accessor $close: HTMLButtonElement | null;
    accessor $header: HTMLElement;
    accessor $body: HTMLElement;
    accessor $footer: HTMLElement;
    accessor $headerSlot: HTMLSlotElement;
    accessor $bodySlot: HTMLSlotElement;
    accessor $footerSlot: HTMLSlotElement;
    _clickOutside: SetupClickOutside<this>;
    constructor();
}
