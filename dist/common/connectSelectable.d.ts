import { BlComponentEventListener, BlComponentEventMap } from '../components/component/Component.js';
export interface ISelected<T = any> {
    value: T;
    label: string;
}
export type ISelectPair<T = any> = [ISelected<T> | null, ISelected<T> | null];
export interface ISelectResultEventMap<T = any> extends BlComponentEventMap {
    'select-result:clear': CustomEvent;
    'select-result:search': CustomEvent<{
        searchString: string;
    }>;
    'select-result:deselect': CustomEvent<{
        value: ISelected<T>;
    }>;
    'select-result:after-accept-selected': CustomEvent;
}
export interface ISelectListEventMap<T = any> extends BlComponentEventMap {
    'select-list:change': CustomEvent<{
        value: ISelected<T>[];
    }>;
    'select-list:after-clear': CustomEvent;
    'select-list:after-deselect': CustomEvent;
    'select-list:after-search': CustomEvent;
}
export interface ISelectResultComponent<T = any> extends HTMLElement {
    acceptSelected(value: ISelected<T>[]): void;
    clearSearch?(): void;
    afterListClear?(): void;
    afterListDeselect?(): void;
    afterListSearch?(): void;
    addEventListener<K extends keyof ISelectResultEventMap<T>>(type: K, listener: BlComponentEventListener<ISelectResultEventMap<T>[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ISelectResultEventMap<T>>(type: K, listener: BlComponentEventListener<ISelectResultEventMap<T>[K]>, options?: boolean | EventListenerOptions): void;
}
export interface ISelectableListComponent<T = any> extends HTMLElement {
    clearSelected(): void;
    deselect?(data: ISelected<T>): void;
    afterResultAccepted?(): void;
    searchSelectable?(keyword: string): void;
    addEventListener<K extends keyof ISelectListEventMap<T>>(type: K, listener: BlComponentEventListener<ISelectListEventMap<T>[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ISelectListEventMap<T>>(type: K, listener: BlComponentEventListener<ISelectListEventMap<T>[K]>, options?: boolean | EventListenerOptions): void;
}
export interface IPairSelectResultEventMap extends BlComponentEventMap {
    'pair-result:clear': CustomEvent;
    'pair-result:after-accept-selected': CustomEvent;
}
export interface IPairSelectListEventMap<T = any> extends BlComponentEventMap {
    'pair-select-list:change': CustomEvent<{
        value: ISelectPair<T>;
    }>;
    'pair-select-list:after-clear': CustomEvent;
}
export interface IPairSelectResultComponent<T = any> extends HTMLElement {
    acceptSelected(value: ISelectPair<T>): void;
    afterListClear?(): void;
    addEventListener<K extends keyof IPairSelectResultEventMap>(type: K, listener: BlComponentEventListener<IPairSelectResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof IPairSelectResultEventMap>(type: K, listener: BlComponentEventListener<IPairSelectResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export interface IPairSelectableListComponent<T = any> extends HTMLElement {
    clearSelected(): void;
    afterResultAccepted?(): void;
    addEventListener<K extends keyof IPairSelectListEventMap<T>>(type: K, listener: BlComponentEventListener<IPairSelectListEventMap<T>[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof IPairSelectListEventMap<T>>(type: K, listener: BlComponentEventListener<IPairSelectListEventMap<T>[K]>, options?: boolean | EventListenerOptions): void;
}
export declare function connectSelectable<T = any>($result: ISelectResultComponent<T>, $list: ISelectableListComponent<T>, options?: {
    captureList?: boolean;
    captureResult?: boolean;
    transformSelectedForResult?: (selected: ISelected<T>) => ISelected;
    transformSelectedForList?: (selected: ISelected<T>) => ISelected;
    afterHandleListChange?: (selected: ISelected<T>[]) => void;
    afterHandleResultClear?: () => void;
    afterHandleResultDeselect?: (selected: ISelected<T>) => void;
    afterHandleResultSearch?: (searchString: string) => void;
}): () => void;
export declare function connectPairSelectable<T = any>($result: IPairSelectResultComponent<T>, $list: IPairSelectableListComponent<T>, options?: {
    captureList?: boolean;
    captureResult?: boolean;
    transformSelectedForResult?: (selected: ISelected<T>) => ISelected<T>;
    transformSelectedForList?: (selected: ISelected<T>) => ISelected<T>;
    afterHandleListChange?: (pair: ISelectPair<T>) => void;
    afterHandleResultClear?: () => void;
    afterHandleResultDeselect?: () => void;
    afterHandleResultSearch?: () => void;
}): () => void;
export declare function makeISelectableProxy<T>(): ISelectResultComponent<T> & ISelectableListComponent<T>;
export declare function makeIPairSelectableProxy<T>(): ISelectResultComponent<T> & IPairSelectableListComponent<T>;
