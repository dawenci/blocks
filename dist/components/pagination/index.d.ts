import '../icon/index.js';
import { BlComponent, BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
export type PaginationEventMap = BlComponentEventMap;
export interface BlPagination extends BlComponent {
    addEventListener<K extends keyof PaginationEventMap>(type: K, listener: BlComponentEventListener<PaginationEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof PaginationEventMap>(type: K, listener: BlComponentEventListener<PaginationEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlPagination extends BlComponent {
    static get observedAttributes(): string[];
    accessor disabled: boolean;
    accessor current: number;
    accessor pageSize: number;
    accessor total: number;
    accessor pageSizes: string;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor $pager: HTMLElement;
    accessor $items: HTMLElement;
    accessor $prev: HTMLButtonElement;
    accessor $next: HTMLButtonElement;
    accessor $jump: HTMLElement;
    accessor $sizes: HTMLElement;
    accessor $total: HTMLElement;
    constructor();
    _itemPool: HTMLElement[];
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
