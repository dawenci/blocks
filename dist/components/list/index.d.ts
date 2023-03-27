import type { ComponentEventListener } from '../component/Component.js';
import type { ISelected, ISelectListEventMap, ISelectableListComponent } from '../../common/connectSelectable.js';
import type { VListEventMap } from '../vlist/index.js';
import { BlocksVList } from '../vlist/index.js';
import { SetupDisabled } from '../setup-disabled/index.js';
import { SetupTabIndex } from '../setup-tab-index/index.js';
interface BlocksListEventMap extends VListEventMap, ISelectListEventMap {
}
export interface BlocksList extends BlocksVList, ISelectableListComponent {
    idMethod?: (data: any) => string;
    labelMethod?: (data: any) => string;
    addEventListener<K extends keyof BlocksListEventMap>(type: K, listener: ComponentEventListener<BlocksListEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksListEventMap>(type: K, listener: ComponentEventListener<BlocksListEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksList extends BlocksVList {
    #private;
    accessor border: boolean;
    accessor stripe: boolean;
    accessor disabled: boolean;
    accessor disabledField: string;
    accessor idField: string;
    accessor labelField: string | null;
    accessor checkable: boolean;
    accessor multiple: boolean;
    accessor search: string | null;
    _disabledFeature: SetupDisabled<this>;
    _tabIndexFeature: SetupTabIndex<this>;
    constructor();
    get checkedData(): object[];
    set checkedData(data: object[]);
    get checked(): string[];
    set checked(ids: string[]);
    focusById(id: string): void;
    focusNext(): void;
    focusPrev(): void;
    select(data: ISelected): void;
    deselect(data: ISelected): void;
    searchSelectable(searchString: string): void;
    clearSelected(): void;
    selectById(id: string): void;
    deselectById(id: string): void;
    _renderDisabled(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    internalLabelMethod(data: any): any;
    keyMethod(data: any): string;
    filterMethod(data: any): Promise<any>;
    parseHighlight(label: string, highlightText: string): {
        text: string;
        highlight: boolean;
    }[];
    _renderItemFocus($item: HTMLElement, vitem: any): void;
    _renderItemChecked($item: HTMLElement, vitem: any): void;
    _renderItemDisabled($item: HTMLElement, vitem: any): void;
    itemRender($item: HTMLElement, vitem: any): void;
}
export {};
