import { Component, ComponentEventListener } from '../Component.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
export type BlocksModalMaskEventMap = WithOpenTransitionEventMap;
export interface BlocksModalMask extends Component, WithOpenTransition {
    addEventListener<K extends keyof BlocksModalMaskEventMap>(type: K, listener: ComponentEventListener<BlocksModalMaskEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksModalMaskEventMap>(type: K, listener: ComponentEventListener<BlocksModalMaskEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksModalMask extends Component {
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _updateVisible(): void;
    isScrollLocked?: boolean;
    bodyPaddingRight?: string;
    bodyOverflowY?: string;
    computedBodyPaddingRight?: number;
    _lockScroll(): void;
    _unlockScroll(): void;
}
