import { Control } from '../base-control/index.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import { ComponentEventListener } from '../Component.js';
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
declare type AnchorFn = () => null | string | Element;
declare type Anchor = null | string | Element | AnchorFn;
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
    constructor();
    get origin(): PopupOrigin;
    set origin(value: PopupOrigin);
    get inset(): boolean;
    set inset(value: boolean);
    get anchor(): Anchor;
    set anchor(value: Anchor);
    get offset(): [number, number];
    set offset(value: [number, number]);
    get appendToBody(): boolean;
    set appendToBody(value: boolean);
    get arrow(): boolean;
    set arrow(value: boolean);
    get autofocus(): boolean;
    set autofocus(value: boolean);
    get capturefocus(): boolean;
    set capturefocus(value: boolean);
    get autoflip(): boolean;
    set autoflip(value: boolean);
    get restorefocus(): boolean;
    set restorefocus(value: boolean);
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
