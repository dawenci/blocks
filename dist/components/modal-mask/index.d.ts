import type { BlComponentEventListener } from '../component/Component.js';
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import { BlComponent } from '../component/Component.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
export type BlModalMaskEventMap = WithOpenTransitionEventMap;
export interface BlModalMask extends WithOpenTransition {
    addEventListener<K extends keyof BlModalMaskEventMap>(type: K, listener: BlComponentEventListener<BlModalMaskEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlModalMaskEventMap>(type: K, listener: BlComponentEventListener<BlModalMaskEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlModalMask extends BlComponent {
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
