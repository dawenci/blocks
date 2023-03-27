import type { EnumAttr } from '../../decorators/attr.js';
import { ComponentEventListener } from '../component/Component.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
export declare enum PopupOrigin {
    Center = "center",
    TopStart = "top-start",
    TopCenter = "top-center",
    TopEnd = "top-end",
    RightStart = "right-start",
    RightCenter = "right-center",
    RightEnd = "right-end",
    BottomEnd = "bottom-end",
    BottomCenter = "bottom-center",
    BottomStart = "bottom-start",
    LeftEnd = "left-end",
    LeftCenter = "left-center",
    LeftStart = "left-start"
}
declare const originArray: PopupOrigin[];
interface PopupEventMap extends WithOpenTransitionEventMap {
    test: CustomEvent;
}
export interface BlocksPopup extends Control, WithOpenTransition {
    addEventListener<K extends keyof PopupEventMap>(type: K, listener: ComponentEventListener<PopupEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof PopupEventMap>(type: K, listener: ComponentEventListener<PopupEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksPopup extends Control {
    #private;
    static get role(): string;
    accessor origin: EnumAttr<typeof originArray>;
    accessor inset: boolean;
    accessor appendToBody: boolean;
    accessor arrow: boolean;
    accessor arrowSize: number;
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
    accessor $firstFocusable: HTMLButtonElement | null;
    accessor $lastFocusable: HTMLButtonElement | null;
    accessor $arrowWrapper: HTMLElement;
    accessor $arrow: HTMLElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    updatePositionAndDirection(): void;
    updateArrow(): void;
}
export {};
