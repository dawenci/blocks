import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
import { RowColumn } from './RowColumn.js';
import { BlocksTable } from './table.js';
export type CellElement = HTMLElement & {
    column: RowColumn;
};
export interface TableHeaderEventMap extends ComponentEventMap {
    'enter-cell': CustomEvent<{
        $cell: CellElement;
        column: RowColumn;
    }>;
    sort: CustomEvent<{
        column: RowColumn;
    }>;
}
export interface BlocksTableHeader extends Component {
    _ref: {
        $host?: BlocksTable;
        $viewport: HTMLElement;
        $canvas: HTMLElement;
    };
    addEventListener<K extends keyof TableHeaderEventMap>(type: K, listener: ComponentEventListener<TableHeaderEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof TableHeaderEventMap>(type: K, listener: ComponentEventListener<TableHeaderEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksTableHeader extends Component {
    static get observedAttributes(): never[];
    _columns: RowColumn[];
    fixedLeftColumns: RowColumn[];
    fixedRightColumns: RowColumn[];
    constructor();
    get $host(): BlocksTable | undefined;
    set $host(table: BlocksTable | undefined);
    get columns(): RowColumn[];
    set columns(value: RowColumn[]);
    get viewportScrollLeft(): number;
    set viewportScrollLeft(value: number);
    _initHoverEvent(): void;
    widthSum(column: RowColumn, value?: number): number;
    getFixedOffsetLeft(column: RowColumn): number;
    getFixedOffsetRight(column: RowColumn): number;
    render(): void;
    connectedCallback(): void;
}
