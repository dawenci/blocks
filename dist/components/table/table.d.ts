import type { BlocksTableBody } from './body.js';
import type { BlocksTableHeader, CellElement as HeaderCell } from './header.js';
import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import type { RowColumn } from './RowColumn.js';
import type { VirtualItem } from '../vlist/index.js';
import './body.js';
import './header.js';
import '../scrollable/index.js';
import { Component } from '../component/Component.js';
type ResizeHandler = HTMLElement & {
    $cell: HeaderCell;
    column: RowColumn;
};
export interface BlocksTableEventMap extends ComponentEventMap {
    layout: CustomEvent;
}
export interface BlocksTable extends Component {
    $mainHeader: BlocksTableHeader;
    $mainBody: BlocksTableBody;
    $resizeHandle: ResizeHandler;
    $fixedLeftShadow?: HTMLElement;
    $fixedRightShadow?: HTMLElement;
    addEventListener<K extends keyof BlocksTableEventMap>(type: K, listener: ComponentEventListener<BlocksTableEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksTableEventMap>(type: K, listener: ComponentEventListener<BlocksTableEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksTable extends Component {
    #private;
    _data: any;
    _columns: RowColumn[];
    width?: number;
    disableActiveMethod?: (vitem: VirtualItem) => boolean;
    shouldShowFixedColumns?: () => boolean;
    accessor border: boolean;
    constructor();
    get data(): any;
    set data(value: any);
    get columns(): RowColumn[];
    set columns(value: RowColumn[]);
    activeRow: VirtualItem | null;
    resizeHandlerLeft: number;
    resizeHandlerRight: number;
    resizehandler: null;
    resizeStartOffset: number;
    _updateFiexedColumnShadow(): void;
    render(): void;
    _clearResizeHandler?: () => void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    getLeafColumnsWith(pred?: (column: any, parentColumn: any) => boolean): any[];
    getFixedLeafColumns(area: 'left' | 'right'): any[];
    hasFixedLeft(): boolean;
    hasFixedRight(): boolean;
    fixedLeftWidth(): any;
    fixedRightWidth(): any;
    getCanvasWidth(): number;
    layout(canvasWidth: number): void;
    active(rowKey: string): void;
    _getGrowSize(column: RowColumn): number;
    _getShrinkSize(column: RowColumn): number;
    _expandColumns(rest: number, columns: RowColumn[]): void;
    _shrinkColumns(rest: number, columns: RowColumn[]): void;
    _initResizeEvent(): void;
}
export {};
