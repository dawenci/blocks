import { BlocksVList, VListEventMap } from '../vlist/index.js';
import { ISelected, ISelectListEventMap, ISelectableListComponent } from '../../common/connectSelectable.js';
import { ComponentEventListener } from '../Component.js';
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
    static get observedAttributes(): string[];
    constructor();
    get disabled(): boolean;
    set disabled(value: boolean);
    get disabledField(): string;
    set disabledField(value: string);
    get idField(): string;
    set idField(value: string);
    get labelField(): string | null;
    set labelField(value: string | null);
    get checkable(): boolean;
    set checkable(value: boolean);
    get multiple(): boolean;
    set multiple(value: boolean);
    get checkedData(): object[];
    set checkedData(data: object[]);
    get checked(): string[];
    set checked(ids: string[]);
    get search(): string | null;
    set search(value: string | null);
    select(data: ISelected): void;
    deselect(data: ISelected): void;
    searchSelectable(searchString: string): void;
    clearSelected(): void;
    _selectItem($item: HTMLElement): void;
    _renderDisabled(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    internalLabelMethod(data: any): any;
    keyMethod(data: any): string;
    filterMethod(data: any): Promise<any>;
    parseHighlight(label: string, highlightText: string): {
        text: string;
        highlight: boolean;
    }[];
    _renderItemDisabled($item: HTMLElement, vitem: any): void;
    itemRender($item: HTMLElement, vitem: any): void;
}
export {};
