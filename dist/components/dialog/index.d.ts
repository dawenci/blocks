import type { BlComponentEventListener } from '../component/Component.js';
import type { BlModalMask } from '../modal-mask/index.js';
import type { BlPopupEventMap } from '../popup/index.js';
import '../close-button/index.js';
import '../modal-mask/index.js';
import { BlPopup } from '../popup/index.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export type BlDialogEventMap = BlPopupEventMap;
interface BlDialog extends BlPopup {
    $mask: BlModalMask | null;
    addEventListener<K extends keyof BlDialogEventMap>(type: K, listener: BlComponentEventListener<BlDialogEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlDialogEventMap>(type: K, listener: BlComponentEventListener<BlDialogEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
declare class BlDialog extends BlPopup {
    #private;
    static get role(): string;
    accessor mask: boolean;
    accessor closeable: boolean;
    accessor titleText: string;
    accessor unmountOnClosed: boolean;
    accessor closeOnClickMask: boolean;
    accessor closeOnClickOutside: boolean;
    accessor closeOnPressEscape: boolean;
    accessor $close: HTMLButtonElement | null;
    accessor $header: HTMLElement;
    accessor $body: HTMLElement;
    accessor $footer: HTMLElement;
    accessor $headerSlot: HTMLSlotElement;
    accessor $bodySlot: HTMLSlotElement;
    accessor $footerSlot: HTMLSlotElement;
    constructor();
    _clickOutside: SetupClickOutside<this>;
}
export { BlDialog };
