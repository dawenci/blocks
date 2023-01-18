import '../icon/index.js';
import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
export interface PaginationEventMap extends ComponentEventMap {
    'bl:pagination:current-change': CustomEvent<{
        current: number;
    }>;
    'bl:pagination:page-size-change': CustomEvent<{
        pageSize: number;
    }>;
}
export interface BlocksPagination extends Component {
    _ref: {
        $pager: HTMLElement;
        $items: HTMLElement;
        $prev: HTMLButtonElement;
        $next: HTMLButtonElement;
        $jump: HTMLElement;
        $sizes: HTMLElement;
        $total: HTMLElement;
    };
    addEventListener<K extends keyof PaginationEventMap>(type: K, listener: ComponentEventListener<PaginationEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof PaginationEventMap>(type: K, listener: ComponentEventListener<PaginationEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksPagination extends Component {
    static get observedAttributes(): string[];
    _itemPool: HTMLElement[];
    constructor();
    get current(): number;
    set current(value: number);
    get disabled(): boolean;
    set disabled(value: boolean);
    get pageSize(): number;
    set pageSize(value: number);
    get pageSizes(): string | null;
    set pageSizes(value: string | null);
    get showQuickJumper(): void;
    get showSizeChanger(): void;
    get showTotal(): void;
    get size(): "small" | "large" | null;
    set size(value: "small" | "large" | null);
    get total(): number;
    set total(value: number);
    get itemCount(): number;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    _renderPager(): void;
    _ensureItem(n: number): void;
    _prev(): void;
    _next(): void;
    _quickPrev(): void;
    _quickNext(): void;
}
