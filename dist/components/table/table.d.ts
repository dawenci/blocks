import type { BlTableBody } from './body.js';
import type { BlTableHeader, CellElement as HeaderCell } from './header.js';
import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import type { RowColumn } from './RowColumn.js';
import type { VirtualItem } from '../vlist/index.js';
import './body.js';
import './header.js';
import '../scrollable/index.js';
import { BlComponent } from '../component/Component.js';
type ResizeHandler = HTMLElement & {
    $cell: HeaderCell;
    column: RowColumn;
};
export interface BlTableEventMap extends BlComponentEventMap {
    layout: CustomEvent;
}
export interface BlTable extends BlComponent {
    $fixedLeftShadow?: HTMLElement;
    $fixedRightShadow?: HTMLElement;
    addEventListener<K extends keyof BlTableEventMap>(type: K, listener: BlComponentEventListener<BlTableEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlTableEventMap>(type: K, listener: BlComponentEventListener<BlTableEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlTable extends BlComponent {
    #private;
    static get role(): string;
    _data: any;
    _columns: RowColumn[];
    width?: number;
    disableActiveMethod?: (vitem: VirtualItem) => boolean;
    shouldShowFixedColumns?: () => boolean;
    accessor border: boolean;
    accessor columns: RowColumn[];
    accessor data: any[];
    accessor $mainHeader: BlTableHeader;
    accessor $mainBody: BlTableBody;
    accessor $resizeHandle: ResizeHandler;
    constructor();
    activeRow: VirtualItem | null;
    resizeHandlerLeft: number;
    resizeHandlerRight: number;
    resizehandler: null;
    resizeStartOffset: number;
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
}
export {};
