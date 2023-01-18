import '../scrollable/index.js';
import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
import { BlocksScrollable } from '../scrollable/index.js';
interface TimeEventMap extends ComponentEventMap {
    change: CustomEvent<{
        hour: number;
        minute: number;
        second: number;
    }>;
}
declare const mutableAttrs: readonly ["hour", "minute", "second", "size"];
declare type MutableAttrs = typeof mutableAttrs[number];
export declare class BlocksTime extends Component {
    #private;
    ref: {
        $layout: HTMLElement;
        $hours: BlocksScrollable;
        $minutes: BlocksScrollable;
        $seconds: BlocksScrollable;
    };
    static get observedAttributes(): readonly ["hour", "minute", "second", "size"];
    constructor();
    get disabledHour(): ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined;
    set disabledHour(value: ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined);
    get disabledMinute(): ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined;
    set disabledMinute(value: ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined);
    get disabledSecond(): ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined;
    set disabledSecond(value: ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined);
    get hour(): number | null;
    set hour(value: number | null);
    get minute(): number | null;
    set minute(value: number | null);
    get second(): number | null;
    set second(value: number | null);
    get value(): [number, number, number] | null;
    set value(value: [number, number, number] | null);
    connectedCallback(): void;
    attributeChangedCallback(attrName: MutableAttrs, oldValue: any, newValue: any): void;
    render(): void;
    clear(): void;
    _scrollToActive(): void;
    scrollToActive(): void;
    triggerChange(): void;
    addEventListener<K extends keyof TimeEventMap>(type: K, listener: ComponentEventListener<TimeEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof TimeEventMap>(type: K, listener: ComponentEventListener<TimeEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export {};
