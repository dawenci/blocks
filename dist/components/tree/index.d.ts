import type { BlComponentEventListener } from '../component/Component.js';
import type { ISelectableListComponent, ISelectListEventMap } from '../../common/connectSelectable.js';
import type { VListEventMap } from '../vlist/index.js';
import { BlVList, VirtualItem } from '../vlist/index.js';
export type NodeData = {
    [index: number]: any;
    [key: string]: any;
    children?: NodeData[];
};
export interface TreeEventMap extends VListEventMap, ISelectListEventMap {
    change: CustomEvent;
    active: CustomEvent<{
        key: string;
        oldKey: string;
    }>;
    inactive: CustomEvent<{
        key: string;
    }>;
    uncheck: CustomEvent<{
        key: string;
    }>;
    check: CustomEvent<{
        key: string;
    }>;
    expand: CustomEvent<{
        key: string;
    }>;
    fold: CustomEvent<{
        key: string;
    }>;
}
export interface VirtualNode extends VirtualItem {
    parentKey: string;
    expanded: boolean;
    checked: boolean;
    indeterminate: boolean;
    parent?: this | null;
    children: this[];
    _retain: boolean;
}
export declare class VirtualNode extends VirtualItem {
    constructor(options: any);
}
export interface BlTree extends BlVList, ISelectableListComponent {
    addEventListener<K extends keyof TreeEventMap>(type: K, listener: BlComponentEventListener<TreeEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof TreeEventMap>(type: K, listener: BlComponentEventListener<TreeEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlTree extends BlVList implements ISelectableListComponent {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    accessor activeKey: string | null;
    accessor activable: boolean;
    accessor checkable: boolean;
    accessor checkOnClickNode: boolean;
    accessor checkStrictly: boolean;
    accessor defaultFoldAll: boolean;
    accessor disabled: boolean;
    accessor expandOnClickNode: boolean;
    accessor wrap: boolean;
    accessor multiple: boolean;
    accessor indentUnit: number;
    accessor idField: string | null;
    accessor labelField: string | null;
    accessor search: string | null;
    labelMethod?: (data: any) => string;
    _checkedSet: Set<VirtualNode>;
    constructor();
    get checkedData(): NodeData[];
    set checkedData(value: NodeData[]);
    get checked(): string[];
    set checked(ids: string[]);
    select(data: NodeData): void;
    deselect(data: NodeData): void;
    clearSelected(): void;
    internalLabelMethod(data: any): any;
    internalKeyMethod(data: any): any;
    filterMethod(data: any[], callback: (data: any) => any): any;
    _renderItemClass($item: HTMLElement, vitem: VirtualNode): void;
    _renderItemArrow($item: HTMLElement, vitem: VirtualNode): void;
    _renderItemCheckable($item: HTMLElement, vitem: VirtualNode): void;
    _renderItemContent($item: HTMLElement, vitem: VirtualNode): void;
    itemRender($item: HTMLElement, vitem: VirtualNode): void;
    disableActiveMethod(data: any): boolean;
    disableToggleMethod(data: any): boolean;
    disableCheckMethod(data: any): boolean;
    active(virtualKey: string, options?: any): void;
    getActive(): string | null;
    clearActive(options?: {
        preventEmit?: boolean;
    }): void;
    expand(virtualKey: string): void;
    fold(virtualKey: string): void;
    toggle(virtualKey: string): void;
    foldAll(): void;
    expandAll(): void;
    virtualMap(data: NodeData[], options: {
        schedule: (task: () => void) => void;
        complete: (virtualData: VirtualNode[]) => void;
    }): void;
    level(node: VirtualNode): number;
    isTopLevel(node: VirtualNode): boolean;
    hasChild(node: VirtualNode): boolean;
    visible(node: VirtualNode): boolean;
    parseHighlight(label: string, highlightText: string): {
        text: string;
        highlight: boolean;
    }[];
}
