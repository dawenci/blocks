import { BlocksVList, VListEventMap } from '../vlist/index.js';
import { BlocksTable } from './table.js';
import { RowColumn } from './RowColumn.js';
import { ComponentEventListener } from '../Component.js';
export type CellElement = HTMLElement & {
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
    static get observedAttributes(): string[];
    columns: RowColumn[];
    flattenColumns: RowColumn[];
    fixedLeftColumns: RowColumn[];
    fixedRightColumns: RowColumn[];
    accessor sortField: string | null;
    accessor sortOrder: string | null;
    accessor summaryHeight: number;
    constructor();
    get $host(): BlocksTable;
    set $host(table: BlocksTable);
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
}
