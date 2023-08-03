import type { BlTable } from './table.js';
import type { BlComponentEventListener } from '../component/Component.js';
import type { RowColumn } from './RowColumn.js';
import type { VListEventMap } from '../vlist/index.js';
import { BlVList } from '../vlist/index.js';
export type CellElement = HTMLElement & {
    column: RowColumn;
    data: any;
};
export interface BlTableBodyEventMap extends VListEventMap {
    'click-cell': CustomEvent<{
        $el: CellElement;
        column: RowColumn;
    }>;
    'click-row': CustomEvent<{
        $el: HTMLElement;
        data: any;
    }>;
}
export interface BlTableBody extends BlVList {
    $host: BlTable;
    $summary?: HTMLElement;
    addEventListener<K extends keyof BlTableBodyEventMap>(type: K, listener: BlComponentEventListener<BlTableBodyEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlTableBodyEventMap>(type: K, listener: BlComponentEventListener<BlTableBodyEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlTableBody extends BlVList {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    columns: RowColumn[];
    flattenColumns: RowColumn[];
    fixedLeftColumns: RowColumn[];
    fixedRightColumns: RowColumn[];
    accessor border: boolean;
    accessor sortField: string | null;
    accessor sortOrder: string | null;
    accessor summaryHeight: number;
    constructor();
    get shouldRenderSummary(): boolean;
    sortMethod(data: any[], callback: (data: any) => any): any;
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
