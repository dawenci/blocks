import { RowColumn } from './RowColumn.js';
import '../scrollable/index.js';
import './header.js';
import './body.js';
import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
import { BlocksTableHeader, CellElement as HeaderCell } from './header.js';
import { BlocksTableBody } from './body.js';
import { VirtualItem } from '../vlist/index.js';
declare type ResizeHandler = HTMLElement & {
    $cell: HeaderCell;
    column: RowColumn;
};
export interface BlocksTableEventMap extends ComponentEventMap {
    layout: CustomEvent;
}
export interface BlocksTable extends Component {
    _ref: {
        $mainHeader: BlocksTableHeader;
        $mainBody: BlocksTableBody;
        $resizeHandle: ResizeHandler;
        $fixedLeftShadow?: HTMLElement;
        $fixedRightShadow?: HTMLElement;
    };
    addEventListener<K extends keyof BlocksTableEventMap>(type: K, listener: ComponentEventListener<BlocksTableEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksTableEventMap>(type: K, listener: ComponentEventListener<BlocksTableEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksTable extends Component {
    _data: any;
    _columns: RowColumn[];
    width?: number;
    disableActiveMethod?: (vitem: VirtualItem) => boolean;
    shouldShowFixedColumns?: () => boolean;
    static get observedAttributes(): string[];
    constructor();
    get border(): boolean;
    set border(value: boolean);
    get data(): any;
    set data(value: any);
    get columns(): RowColumn[];
    set columns(value: RowColumn[]);
    activeRow: VirtualItem | null;
    resizeHandlerLeft: number;
    resizeHandlerRight: number;
    gridId: number;
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
