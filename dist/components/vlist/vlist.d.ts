import type { BlScrollable } from '../scrollable/index.js';
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import type { Schedule } from './schedule.js';
import '../icon/index.js';
import '../scrollable/index.js';
import { BinaryIndexedTree } from './BinaryIndexedTree.js';
import { BlComponent } from '../component/Component.js';
declare const Direction: {
    readonly Vertical: "vertical";
    readonly Horizontal: "horizontal";
};
type DirectionUnion = typeof Direction.Vertical | typeof Direction.Horizontal;
type ElementWithData = HTMLElement & {
    virtualKey: string;
    virtualViewIndex: number;
};
declare const ITEMS_SIZE_UPDATE = "items-size-change";
declare const DATA_BOUND = "data-bound";
declare const DATA_VIEW_CHANGE = "view-data-change";
declare const SLICE_CHANGE = "slice-change";
declare const BEFORE_RENDER = "before-render";
declare const AFTER_RENDER = "after-render";
export interface VListEventMap extends BlComponentEventMap {
    [ITEMS_SIZE_UPDATE]: CustomEvent<Array<{
        key: string;
        value: number;
    }>>;
    [DATA_BOUND]: CustomEvent<{
        virtualData: VirtualItem[];
        virtualDataMap: Record<string, VirtualItem>;
    }>;
    [DATA_VIEW_CHANGE]: CustomEvent<{
        getData: () => any[];
    }>;
    [SLICE_CHANGE]: CustomEvent<{
        slice: any[];
        oldSlice: any[];
    }>;
    [BEFORE_RENDER]: CustomEvent;
    [AFTER_RENDER]: CustomEvent;
}
type ItemOptions = {
    virtualKey?: string;
    height?: number;
    calculated?: boolean;
    virtualViewIndex?: number;
    data: object;
};
export interface VirtualItem {
    virtualKey: string;
    height: number;
    calculated: boolean;
    virtualViewIndex: number;
    data: object;
}
export declare class VirtualItem {
    constructor(options: ItemOptions);
}
export interface BlVList extends BlComponent {
    beforeRender?(): void;
    afterRender?(): void;
    keyMethod?(data: object): string;
    itemRender($item: HTMLElement, vitem: any): void;
}
export declare class BlVList extends BlComponent {
    #private;
    static get observedAttributes(): string[];
    accessor direction: DirectionUnion;
    accessor defaultItemSize: number;
    accessor fixedItemSize: boolean;
    accessor shadow: boolean;
    accessor crossSize: number;
    sliceFrom?: number;
    sliceTo?: number;
    anchorIndex?: number;
    anchorOffsetRatio?: number;
    clearDomEvents?(): void;
    protected isDataBound: boolean;
    protected isDataBinding: boolean;
    protected virtualData: VirtualItem[];
    protected virtualViewData: VirtualItem[];
    protected virtualSliceData: VirtualItem[];
    protected virtualDataMap: Record<string, VirtualItem>;
    protected itemHeightStore: BinaryIndexedTree;
    accessor $viewport: BlScrollable;
    accessor $listSize: HTMLElement;
    accessor $list: HTMLElement;
    accessor $busy: HTMLElement;
    constructor();
    get data(): object[];
    set data(value: object[]);
    get viewportWidth(): number;
    get viewportHeight(): number;
    get viewportMainSize(): number;
    get viewportCrossSize(): number;
    get mainSize(): number;
    get hasMainScrollbar(): boolean;
    get hasCrossScrollbar(): boolean;
    initDomEvent(): void;
    getData(): object[];
    setData(value: object[], options?: {
        schedule?: Schedule;
        complete?: () => void;
    }): void;
    itemSizeMethod($node: HTMLElement, options: any): number;
    hasKey(virtualKey: string): boolean;
    render(): void;
    redraw(): void;
    filterMethod<T>(data: T[], callback: (data: T[]) => any): any;
    sortMethod<T>(data: T[], callback: (data: T[]) => any): any;
    bindData(data: object[], options: {
        complete: () => void;
        schedule: Schedule;
    }): void;
    virtualMap(data: object[], options: {
        schedule: Schedule;
        complete: (virtualData: VirtualItem[]) => void;
    }): void;
    generateViewData(options: {
        complete: () => void;
    }): void;
    showByKeys(keys: string[], withoutAnimation?: boolean): Promise<void>;
    hideByKeys(keys: string[], withoutAnimation?: boolean): Promise<void>;
    showAll(): void;
    nextTick(callback: () => void): void;
    preRenderingCount(viewportSize: number): number;
    preRenderingThreshold(viewportSize: number): number;
    scrollToIndex(anchorIndex: number, anchorOffsetRatio?: number): void;
    backScrollToIndex(anchorIndex: number, anchorOffsetRatio?: number): void;
    scrollToKey(key: string, anchorOffsetRatio: number): void;
    backScrollToKey(key: string, anchorOffsetRatio: number): void;
    restoreAnchor(): void;
    getScrollMain(): number;
    getScrollCross(): number;
    setScrollMain(value: number): void;
    setScrollCross(value: number): void;
    _updateSliceRange(forceUpdate?: boolean): void;
    _calcSliceRange(viewportSize: number, viewportStart: number): {
        sliceFrom: number;
        sliceTo: number;
        anchorOffsetRatio: number | undefined;
    };
    _doSlice(fromIndex: number, toIndex: number): void;
    _updateSizeByItems(nodeItems: ElementWithData[]): void;
    _batchUpdateHeight(records: any[]): void;
    _updateSize(vItem: VirtualItem, height: number, calculated?: boolean): boolean;
    getVirtualItemByNode($node: ElementWithData): VirtualItem;
    getVirtualItemByKey(virtualKey: string): VirtualItem;
    getNodeByVirtualKey(virtualKey: string): HTMLElement;
    _pluckData(virtualData: VirtualItem[]): any[];
    _updateListSize(): void;
    _resetCalculated(): void;
    _itemSize(index: number): number;
    _itemOffset(index: number): number;
    _clearTransition(): Promise<boolean>;
    addEventListener<K extends keyof VListEventMap>(type: K, listener: BlComponentEventListener<VListEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof VListEventMap>(type: K, listener: BlComponentEventListener<VListEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export {};
