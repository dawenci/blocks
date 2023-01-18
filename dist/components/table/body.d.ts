import { BlocksVList, VListEventMap } from '../vlist/index.js';
import { BlocksTable } from './table.js';
import { RowColumn } from './RowColumn.js';
import { ComponentEventListener } from '../Component.js';
export declare type CellElement = HTMLElement & {
    column: RowColumn;
    data: any;
};
export interface BlocksTableBodyEventMap extends VListEventMap {
    'click-cell': CustomEvent<{
        $el: CellElement;
        column: RowColumn;
    }>;
    'click-row': CustomEvent<{
        $el: HTMLElement;
        data: any;
    }>;
}
export interface BlocksTableBody extends BlocksVList {
    _ref: BlocksVList['_ref'] & {
        $host: BlocksTable;
        $summary?: HTMLElement;
    };
    addEventListener<K extends keyof BlocksTableBodyEventMap>(type: K, listener: ComponentEventListener<BlocksTableBodyEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksTableBodyEventMap>(type: K, listener: ComponentEventListener<BlocksTableBodyEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksTableBody extends BlocksVList {
    #private;
    columns: RowColumn[];
    flattenColumns: RowColumn[];
    fixedLeftColumns: RowColumn[];
    fixedRightColumns: RowColumn[];
    constructor();
    get $host(): BlocksTable;
    set $host(table: BlocksTable);
    get sortField(): string | null;
    set sortField(value: string | null);
    get sortOrder(): string | null;
    set sortOrder(value: string | null);
    get summaryHeight(): number;
    set summaryHeight(value: number);
    get shouldRenderSummary(): boolean;
    sortMethod(data: any[]): Promise<any[]>;
    beforeRender(): void;
    afterRender(): void;
    itemRender($item: any, vitem: any): void;
    _renderSummaryRow(): void;
    getFixedOffsetLeft(column: RowColumn): number;
    getFixedOffsetRight(column: RowColumn): number;
    getFixedLeftShadowPosition(): number;
    getFixedRightShadowPosition(): number;
    _onClick(e: MouseEvent): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    doSort(): void;
    static get observedAttributes(): string[];
}
