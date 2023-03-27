import type { ComponentEventListener } from '../component/Component.js';
import type { BlocksModalMask } from '../modal-mask/index.js';
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import '../modal-mask/index.js';
import { BlocksPopup } from '../popup/index.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
type BlocksDialogEventMap = WithOpenTransitionEventMap;
interface BlocksDialog extends BlocksPopup {
    $mask: BlocksModalMask | null;
    addEventListener<K extends keyof BlocksDialogEventMap>(type: K, listener: ComponentEventListener<BlocksDialogEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksDialogEventMap>(type: K, listener: ComponentEventListener<BlocksDialogEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
declare class BlocksDialog extends BlocksPopup {
    #private;
    static get role(): string;
    accessor mask: boolean;
    accessor closeable: boolean;
    accessor titleText: string;
    accessor unmountAfterClose: boolean;
    accessor closeOnClickMask: boolean;
    accessor closeOnClickOutside: boolean;
    accessor closeOnPressEscape: boolean;
    accessor $close: HTMLButtonElement | null;
    accessor $header: HTMLElement;
    accessor $body: HTMLElement;
    accessor $footer: HTMLElement;
    accessor $headerSlot: HTMLSlotElement;
    accessor $footerSlot: HTMLSlotElement;
    accessor $bodySlot: HTMLSlotElement;
    constructor();
    _clickOutside: SetupClickOutside<this>;
}
export { BlocksDialog };
