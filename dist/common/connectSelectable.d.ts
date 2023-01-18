import { ComponentEventListener, ComponentEventMap } from '../components/Component.js';
export interface ISelected {
    value: any;
    label: string;
}
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
    'select-list:select': CustomEvent<{
        value: ISelected;
    }>;
    'select-list:deselect': CustomEvent<{
        value: ISelected;
    }>;
    'select-list:change': CustomEvent<{
        value: ISelected[];
    }>;
}
export interface ISelectResultComponent extends HTMLElement {
    acceptSelected(value: ISelected[]): void;
    select?(value: ISelected): void;
    deselect?(value: ISelected): void;
    addEventListener<K extends keyof ISelectResultEventMap>(type: K, listener: ComponentEventListener<ISelectResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ISelectResultEventMap>(type: K, listener: ComponentEventListener<ISelectResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export interface ISelectableListComponent extends HTMLElement {
    clearSelected(): void;
    searchSelectable?(keyword: string): void;
    select?(value: ISelected): void;
    deselect(data: ISelected): void;
    addEventListener<K extends keyof ISelectListEventMap>(type: K, listener: ComponentEventListener<ISelectListEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ISelectListEventMap>(type: K, listener: ComponentEventListener<ISelectListEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare function connectSelectable($result: ISelectResultComponent, $list: ISelectableListComponent, options?: {
    captureList?: boolean;
    captureResult?: boolean;
}): () => void;
