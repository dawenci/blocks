import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
export interface ScrollableEventMap extends ComponentEventMap {
    'bl:scroll': CustomEvent;
    'bl:resize': CustomEvent<{
        width: number;
        height: number;
    }>;
    'bl:change:can-scroll-top': CustomEvent<{
        value: boolean;
    }>;
    'bl:change:can-scroll-right': CustomEvent<{
        value: boolean;
    }>;
    'bl:change:can-scroll-bottom': CustomEvent<{
        value: boolean;
    }>;
    'bl:change:can-scroll-left': CustomEvent<{
        value: boolean;
    }>;
    'bl:drag-scroll-end': CustomEvent;
}
export interface BlocksScrollable extends Component {
    _ref: {
        $layout: HTMLElement;
        $viewport: HTMLElement;
        $horizontal: HTMLElement;
        $vertical: HTMLElement;
        $horizontalThumb: HTMLElement;
        $verticalThumb: HTMLElement;
    };
    addEventListener<K extends keyof ScrollableEventMap>(type: K, listener: ComponentEventListener<ScrollableEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ScrollableEventMap>(type: K, listener: ComponentEventListener<ScrollableEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksScrollable extends Component {
    #private;
    static get observedAttributes(): string[];
    accessor shadow: boolean;
    constructor();
    get canScrollLeft(): boolean | undefined;
    set canScrollLeft(value: boolean | undefined);
    get canScrollRight(): boolean | undefined;
    set canScrollRight(value: boolean | undefined);
    get canScrollTop(): boolean | undefined;
    set canScrollTop(value: boolean | undefined);
    get canScrollBottom(): boolean | undefined;
    set canScrollBottom(value: boolean | undefined);
    get viewportScrollLeft(): number;
    set viewportScrollLeft(value: number);
    get viewportScrollTop(): number;
    set viewportScrollTop(value: number);
    get hasVerticalScrollbar(): boolean;
    get hasHorizontalScrollbar(): boolean;
    toggleViewportClass(className: string, value: boolean): void;
    _updateScrollbar(): void;
    _updateScrollable(): void;
    _getThumbTop(): number;
    _getThumbLeft(): number;
    getScrollableTop(): number;
    getScrollableRight(): number;
    getScrollableBottom(): number;
    getScrollableLeft(): void;
    _updateShadowState(): void;
    _udpateScrollbarState(): void;
    _initMoveEvents(): void;
    connectedCallback(): void;
}
