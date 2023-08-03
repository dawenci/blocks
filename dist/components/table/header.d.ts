import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import type { RowColumn } from './RowColumn.js';
import { BlTable } from './table.js';
import { BlComponent } from '../component/Component.js';
export type CellElement = HTMLElement & {
    column: RowColumn;
};
export interface TableHeaderEventMap extends BlComponentEventMap {
    'enter-cell': CustomEvent<{
        $cell: CellElement;
        column: RowColumn;
    }>;
    sort: CustomEvent<{
        column: RowColumn;
    }>;
}
export interface BlTableHeader extends BlComponent {
    $host: BlTable;
    $viewport: HTMLElement;
    $canvas: HTMLElement;
    addEventListener<K extends keyof TableHeaderEventMap>(type: K, listener: BlComponentEventListener<TableHeaderEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof TableHeaderEventMap>(type: K, listener: BlComponentEventListener<TableHeaderEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlTableHeader extends BlComponent {
    static get role(): string;
    accessor border: boolean;
    _columns: RowColumn[];
    fixedLeftColumns: RowColumn[];
    fixedRightColumns: RowColumn[];
    constructor();
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
