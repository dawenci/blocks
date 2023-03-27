import type { BlocksScrollable } from '../scrollable/index.js';
import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import '../icon/index.js';
import '../scrollable/index.js';
import { BinaryIndexedTree } from './BinaryIndexedTree.js';
import { Component } from '../component/Component.js';
declare const Direction: {
    readonly Vertical: "vertical";
    readonly Horizontal: "horizontal";
};
type DirectionUnion = typeof Direction.Vertical | typeof Direction.Horizontal;
type ElementWithData = HTMLElement & {
    virtualKey: string;
    virtualViewIndex: number;
};
export interface VListEventMap extends ComponentEventMap {
    'items-size-change': CustomEvent<Array<{
        key: string;
        value: number;
    }>>;
    'data-bound': CustomEvent<{
        virtualData: VirtualItem[];
        virtualDataMap: Record<string, VirtualItem>;
    }>;
    'view-data-change': CustomEvent<any[]>;
    'slice-change': CustomEvent<{
        slice: any[];
        oldSlice: any[];
    }>;
    'before-render': CustomEvent;
    'after-render': CustomEvent;
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
export interface BlocksVList extends Component {
    $viewport: BlocksScrollable;
    $listSize: HTMLElement;
    $list: HTMLElement;
    $busy: HTMLElement;
    beforeRender?(): void;
    afterRender?(): void;
    keyMethod?(data: object): string;
    filterMethod?(data: object[]): Promise<any[]>;
    sortMethod?(data: object[]): Promise<any[]>;
    itemRender($item: HTMLElement, vitem: any): void;
}
export declare class BlocksVList extends Component {
    #private;
    static get observedAttributes(): string[];
    accessor direction: DirectionUnion;
    accessor defaultItemSize: number;
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
    constructor();
    initDomEvent(): void;
    get data(): object[];
    set data(value: object[]);
    get viewportWidth(): number;
    get viewportHeight(): number;
    get viewportMainSize(): number;
    get viewportCrossSize(): number;
    get mainSize(): number;
    get hasMainScrollbar(): boolean;
    get hasCrossScrollbar(): boolean;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    itemSizeMethod($node: HTMLElement, options: any): number;
    hasKey(virtualKey: string): boolean;
    render(): void;
    redraw(): void;
    bindData(data: object[]): Promise<void>;
    virtualMap(data: object[]): Promise<VirtualItem[]>;
    generateViewData(): Promise<void>;
    showByKeys(keys: string[], withoutAnimation?: boolean): Promise<void>;
    hideByKeys(keys: string[], withoutAnimation?: boolean): Promise<void>;
    showAll(): void;
    nextTick(callback: () => void): Promise<void>;
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
    addEventListener<K extends keyof VListEventMap>(type: K, listener: ComponentEventListener<VListEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof VListEventMap>(type: K, listener: ComponentEventListener<VListEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export {};
