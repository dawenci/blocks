import type { EnumAttrs } from '../../decorators/attr.js';
import '../icon/index.js';
import { Component, ComponentEventListener, ComponentEventMap } from '../component/Component.js';
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
    accessor disabled: boolean;
    accessor current: number;
    accessor pageSize: number;
    accessor total: number;
    accessor pageSizes: string | null;
    accessor size: EnumAttrs['size'];
    _itemPool: HTMLElement[];
    constructor();
    get showQuickJumper(): void;
    get showSizeChanger(): void;
    get showTotal(): void;
    get itemCount(): number;
    render(): void;
    _renderPager(): void;
    _ensureItem(n: number): void;
    _prev(): void;
    _next(): void;
    _quickPrev(): void;
    _quickNext(): void;
}
