import { Component, ComponentEventMap } from '../components/Component';
export declare function dispatchEvent<T = any>(element: Element, eventName: string, options?: CustomEventInit): boolean;
export declare function onEvent<M, K extends keyof M>(element: Component & {
    disabled: boolean;
}, type: K, listener: (this: typeof element, ev: M[K]) => any, options?: boolean | AddEventListenerOptions): () => void;
export declare function onEvent<K extends keyof ComponentEventMap>(element: Component & {
    disabled: boolean;
}, type: K, listener: (this: typeof element, ev: ComponentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): () => void;
export declare function onEvent(element: Component & {
    disabled: boolean;
}, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): () => void;
