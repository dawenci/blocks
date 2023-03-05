import '../scrollable/index.js';
import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
import { BlocksScrollable } from '../scrollable/index.js';
import type { EnumAttrs } from '../../decorators/attr.js';
interface TimeEventMap extends ComponentEventMap {
    change: CustomEvent<{
        hour: number;
        minute: number;
        second: number;
    }>;
}
declare const mutableAttrs: readonly ["hour", "minute", "second", "size"];
type MutableAttrs = (typeof mutableAttrs)[number];
export interface BlocksTime extends Component {
    _ref: {
        $layout: HTMLElement;
        $hours: BlocksScrollable;
        $minutes: BlocksScrollable;
        $seconds: BlocksScrollable;
    };
    addEventListener<K extends keyof TimeEventMap>(type: K, listener: ComponentEventListener<TimeEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof TimeEventMap>(type: K, listener: ComponentEventListener<TimeEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksTime extends Component {
    #private;
    static get observedAttributes(): readonly ["hour", "minute", "second", "size"];
    accessor hour: number | null;
    accessor minute: number | null;
    accessor second: number | null;
    accessor size: EnumAttrs['size'];
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
    get value(): [number, number, number] | null;
    set value(value: [number, number, number] | null);
    connectedCallback(): void;
    attributeChangedCallback(attrName: MutableAttrs, oldValue: any, newValue: any): void;
    render(): void;
    clear(): void;
    _scrollToActive(): void;
    scrollToActive(): void;
    triggerChange(): void;
}
export {};
