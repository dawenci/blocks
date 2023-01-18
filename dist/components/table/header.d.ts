import { Component } from '../Component.js';
import { RowColumn } from './RowColumn.js';
import { BlocksTable } from './table.js';
export declare type CellElement = HTMLElement & {
    column: RowColumn;
};
export interface TableHeaderEventMap {
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
}
export declare class BlocksTableHeader extends Component {
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
    addEventListener<K extends keyof TableHeaderEventMap>(type: K, listener: (this: this, ev: TableHeaderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: (this: this, ev: Event) => any, options?: boolean | AddEventListenerOptions): void;
    static get observedAttributes(): never[];
}
