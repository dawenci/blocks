import { ComponentEventListener, ComponentEventMap } from '../components/component/Component.js';
export interface ISelected {
    value: any;
    label: string;
}
export type ISelectPair = [ISelected | null, ISelected | null];
export interface ISelectResultEventMap extends ComponentEventMap {
    'select-result:clear': CustomEvent;
    'select-result:search': CustomEvent<{
        searchString: string;
    }>;
    'select-result:deselect': CustomEvent<{
        value: ISelected;
    }>;
}
export interface ISelectListEventMap extends ComponentEventMap {
    'select-list:change': CustomEvent<{
        value: ISelected[];
    }>;
}
export interface ISelectResultComponent extends HTMLElement {
    acceptSelected(value: ISelected[]): void;
    clearSearch?(): void;
    addEventListener<K extends keyof ISelectResultEventMap>(type: K, listener: ComponentEventListener<ISelectResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ISelectResultEventMap>(type: K, listener: ComponentEventListener<ISelectResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export interface ISelectableListComponent extends HTMLElement {
    clearSelected(): void;
    deselect?(data: ISelected): void;
    searchSelectable?(keyword: string): void;
    addEventListener<K extends keyof ISelectListEventMap>(type: K, listener: ComponentEventListener<ISelectListEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ISelectListEventMap>(type: K, listener: ComponentEventListener<ISelectListEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export interface IPairSelectResultEventMap extends ComponentEventMap {
    'pair-result:clear': CustomEvent;
}
export interface IPairSelectListEventMap extends ComponentEventMap {
    'pair-select-list:change': CustomEvent<{
        value: ISelectPair;
    }>;
}
export interface IPairSelectResultComponent extends HTMLElement {
    acceptSelected(value: ISelectPair): void;
    addEventListener<K extends keyof IPairSelectResultEventMap>(type: K, listener: ComponentEventListener<IPairSelectResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof IPairSelectResultEventMap>(type: K, listener: ComponentEventListener<IPairSelectResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export interface IPairSelectableListComponent extends HTMLElement {
    clearSelected(): void;
    addEventListener<K extends keyof IPairSelectListEventMap>(type: K, listener: ComponentEventListener<IPairSelectListEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof IPairSelectListEventMap>(type: K, listener: ComponentEventListener<IPairSelectListEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare function connectSelectable($result: ISelectResultComponent, $list: ISelectableListComponent, options?: {
    captureList?: boolean;
    captureResult?: boolean;
    transformSelectedForResult?: (selected: ISelected) => ISelected;
    transformSelectedForList?: (selected: ISelected) => ISelected;
    afterHandleListChange?: (selected: ISelected[]) => void;
    afterHandleResultClear?: () => void;
    afterHandleResultDeselect?: (selected: ISelected) => void;
    afterHandleResultSearch?: (searchString: string) => void;
}): () => void;
export declare function connectPairSelectable($result: IPairSelectResultComponent, $list: IPairSelectableListComponent, options?: {
    captureList?: boolean;
    captureResult?: boolean;
    transformSelectedForResult?: (selected: ISelected) => ISelected;
    transformSelectedForList?: (selected: ISelected) => ISelected;
    afterHandleListChange?: (pair: ISelectPair) => void;
    afterHandleResultClear?: () => void;
    afterHandleResultDeselect?: () => void;
    afterHandleResultSearch?: () => void;
}): () => void;
