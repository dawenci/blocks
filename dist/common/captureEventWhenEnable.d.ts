import { BlComponent, BlComponentEventMap } from '../components/component/Component.js';
export declare function captureEventWhenEnable<M, K extends keyof M>(element: BlComponent & {
    disabled: boolean;
}, eventType: K, callback: (e: M[K]) => any): () => void;
export declare function captureEventWhenEnable<K extends keyof BlComponentEventMap>(element: BlComponent & {
    disabled: boolean;
}, eventType: K, callback: (e: BlComponentEventMap[K]) => any): () => void;
export declare function captureEventWhenEnable(element: BlComponent & {
    disabled: boolean;
}, eventType: string, callback: (e: Event) => any): () => void;
