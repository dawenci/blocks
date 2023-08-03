import { BlComponent, BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
export interface ScrollableEventMap extends BlComponentEventMap {
    'bl:change:can-scroll-bottom': CustomEvent<{
        value: boolean;
    }>;
    'bl:change:can-scroll-left': CustomEvent<{
        value: boolean;
    }>;
    'bl:change:can-scroll-right': CustomEvent<{
        value: boolean;
    }>;
    'bl:change:can-scroll-top': CustomEvent<{
        value: boolean;
    }>;
    'bl:drag-scroll-end': CustomEvent;
    'bl:resize': CustomEvent<{
        width: number;
        height: number;
    }>;
    'bl:scroll': CustomEvent;
}
export interface BlScrollable extends BlComponent {
    addEventListener<K extends keyof ScrollableEventMap>(type: K, listener: BlComponentEventListener<ScrollableEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ScrollableEventMap>(type: K, listener: BlComponentEventListener<ScrollableEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlScrollable extends BlComponent {
    #private;
    accessor shadow: boolean;
    accessor $layout: HTMLElement;
    accessor $viewport: HTMLElement;
    accessor $horizontal: HTMLElement;
    accessor $vertical: HTMLElement;
    accessor $horizontalThumb: HTMLElement;
    accessor $verticalThumb: HTMLElement;
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
}
