import type { ComponentEventListener } from '../component/Component.js';
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import { Component } from '../component/Component.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
export type BlocksModalMaskEventMap = WithOpenTransitionEventMap;
export interface BlocksModalMask extends Component, WithOpenTransition {
    addEventListener<K extends keyof BlocksModalMaskEventMap>(type: K, listener: ComponentEventListener<BlocksModalMaskEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksModalMaskEventMap>(type: K, listener: ComponentEventListener<BlocksModalMaskEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksModalMask extends Component {
    accessor zIndex: number | null;
    connectedCallback(): void;
    _updateScrollLock(): void;
    isScrollLocked?: boolean;
    bodyPaddingRight?: string;
    bodyOverflowY?: string;
    computedBodyPaddingRight?: number;
    _lockScroll(): void;
    _unlockScroll(): void;
}
