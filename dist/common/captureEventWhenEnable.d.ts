import { Component, ComponentEventMap } from '../components/Component';
export declare function captureEventWhenEnable<M, K extends keyof M>(element: Component & {
    disabled: boolean;
}, eventType: K, callback: (e: M[K]) => any): any;
export declare function captureEventWhenEnable<K extends keyof ComponentEventMap>(element: Component & {
    disabled: boolean;
}, eventType: K, callback: (e: ComponentEventMap[K]) => any): any;
export declare function captureEventWhenEnable(element: Component & {
    disabled: boolean;
}, eventType: string, callback: (e: Event) => any): any;
