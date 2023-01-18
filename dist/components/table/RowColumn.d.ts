export interface RowColumn {
    headRender: (column: any) => Node;
    render: (data: any, column: any, $cell: any) => Node;
    summaryRender: any;
    sortMethod?: any;
    label: string;
    prop: string;
    align: string;
    columnWidth?: number;
    width: number;
    minWidth: number;
    maxWidth: number;
    fixedLeft: boolean;
    fixedRight: boolean;
    sortOrder?: 'none' | 'ascending' | 'descending';
    resizable: boolean;
    children: RowColumn[];
    parent?: RowColumn;
    cellClass?: string[];
}
export declare function setParent(column: RowColumn, parent: RowColumn): void;
export declare function make(options: Partial<RowColumn>): RowColumn;
