import { BlComponent, BlComponentEventMap } from '../components/component/Component.js';
export declare function dispatchEvent<T = any>(element: Element, eventName: string, options?: CustomEventInit): boolean;
export declare function onEvent<M, K extends keyof M, E extends Element = Element>(element: E, type: K, listener: (this: E, ev: M[K]) => any, options?: boolean | AddEventListenerOptions): () => void;
export declare function onEvent<K extends keyof BlComponentEventMap, E extends BlComponent = BlComponent>(element: E, type: K, listener: (this: E, ev: BlComponentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): () => void;
export declare function onEvent<E extends Element = Element>(element: E, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): () => void;
export declare function onceEvent<M, K extends keyof M, E extends Element = Element>(element: E, type: K, listener: (this: E, ev: M[K]) => any, options?: boolean | AddEventListenerOptions): () => void;
export declare function onceEvent<K extends keyof BlComponentEventMap, E extends BlComponent = BlComponent>(element: E, type: K, listener: (this: E, ev: BlComponentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): () => void;
export declare function onceEvent<E extends Element = Element>(element: E, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): () => void;
