import type { BlComponentEventListener } from '../component/Component.js';
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import { BlComponent } from '../component/Component.js';
import { PopupOrigin } from './origin.js';
import { SetupFocusCapture } from '../setup-focus-capture/index.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
declare const originArray: PopupOrigin[];
export type BlPopupEventMap = WithOpenTransitionEventMap;
export interface BlPopup extends WithOpenTransition {
    addEventListener<K extends keyof BlPopupEventMap>(type: K, listener: BlComponentEventListener<BlPopupEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlPopupEventMap>(type: K, listener: BlComponentEventListener<BlPopupEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlPopup extends BlComponent {
    #private;
    accessor origin: OneOf<typeof originArray>;
    accessor inset: boolean;
    accessor appendToBody: boolean;
    accessor arrow: number;
    accessor focusable: boolean;
    accessor autofocus: boolean;
    accessor capturefocus: boolean;
    accessor autoflip: boolean;
    accessor restorefocus: boolean;
    accessor offsetX: number;
    accessor offsetY: number;
    accessor anchorX: number;
    accessor anchorY: number;
    accessor anchorWidth: number;
    accessor anchorHeight: number;
    accessor anchorSelector: string;
    accessor anchorElement: (() => Element) | undefined;
    accessor $layout: HTMLElement;
    accessor $slot: HTMLSlotElement;
    accessor $bg: SVGElement;
    accessor $shadow: SVGElement;
    constructor();
    updatePositionAndDirection(): void;
    updateArrow(): void;
    _focusCapture: SetupFocusCapture<this>;
}
export {};
