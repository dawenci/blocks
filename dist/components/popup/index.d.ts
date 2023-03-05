import { Control } from '../base-control/index.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import { ComponentEventListener } from '../Component.js';
import type { EnumAttr } from '../../decorators/attr.js';
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
type AnchorFn = () => null | string | Element;
type Anchor = null | string | Element | AnchorFn;
interface PopupEventMap extends WithOpenTransitionEventMap {
    test: CustomEvent;
}
export interface BlocksPopup extends Control, WithOpenTransition {
    _ref: Control['_ref'] & {
        $arrow: HTMLElement;
        $slot: HTMLSlotElement;
    };
    addEventListener<K extends keyof PopupEventMap>(type: K, listener: ComponentEventListener<PopupEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof PopupEventMap>(type: K, listener: ComponentEventListener<PopupEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksPopup extends Control {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    accessor origin: EnumAttr<typeof originArray>;
    accessor inset: boolean;
    accessor appendToBody: boolean;
    accessor arrow: boolean;
    accessor autofocus: boolean;
    accessor capturefocus: boolean;
    accessor autoflip: boolean;
    accessor restorefocus: boolean;
    constructor();
    get offset(): [number, number];
    set offset(value: [number, number]);
    get anchor(): Anchor;
    set anchor(value: Anchor);
    getAnchorFrame(): {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    };
    render(): void;
    updatePositionAndDirection(): void;
    _initAnchorEvent(): void;
    _destroyAnchorEvent(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _captureFocus(): void;
    _stopCaptureFocus(): void;
    _updateVisible(): void;
    _isHorizontal(): boolean;
    _isVertical(): boolean;
    _updateClass(): void;
    _updateArrow(): void;
    _focus(): void;
    _blur(): void;
    _setOriginClass(value: string): void;
    _setOrigin(y: 'bottom' | 'center' | 'top', x: 'left' | 'center' | 'right'): void;
}
export {};
