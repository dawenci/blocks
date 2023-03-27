import type { EnumAttr } from '../../decorators/attr.js';
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import '../icon/index.js';
import '../modal-mask/index.js';
import { BlocksModalMask } from '../modal-mask/index.js';
import { BlocksPopup } from '../popup/index.js';
import { ComponentEventListener } from '../component/Component.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
type BlocksDrawerEventMap = WithOpenTransitionEventMap;
export interface BlocksDrawer extends BlocksPopup {
    $mask: BlocksModalMask | null;
    addEventListener<K extends keyof BlocksDrawerEventMap>(type: K, listener: ComponentEventListener<BlocksDrawerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksDrawerEventMap>(type: K, listener: ComponentEventListener<BlocksDrawerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksDrawer extends BlocksPopup {
    #private;
    accessor closeOnClickMask: boolean;
    accessor closeOnClickOutside: boolean;
    accessor closeOnPressEscape: boolean;
    accessor mask: boolean;
    accessor closeable: boolean;
    accessor titleText: string;
    accessor size: string;
    accessor placement: EnumAttr<['right', 'left', 'bottom', 'top']>;
    accessor $close: HTMLButtonElement | null;
    accessor $header: HTMLElement;
    accessor $body: HTMLElement;
    accessor $footer: HTMLElement;
    accessor $headerSlot: HTMLSlotElement;
    accessor $footerSlot: HTMLSlotElement;
    accessor $bodySlot: HTMLSlotElement;
    _clickOutside: SetupClickOutside<this>;
    constructor();
}
export {};
