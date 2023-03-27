import type { BlocksScrollable } from '../scrollable/index.js';
import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import type { EnumAttrs } from '../../decorators/attr.js';
import '../scrollable/index.js';
import { Component } from '../component/Component.js';
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
    addEventListener<K extends keyof TimeEventMap>(type: K, listener: ComponentEventListener<TimeEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof TimeEventMap>(type: K, listener: ComponentEventListener<TimeEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksTime extends Component {
    #private;
    accessor hour: number | null;
    accessor minute: number | null;
    accessor second: number | null;
    accessor size: EnumAttrs['size'];
    accessor $layout: HTMLElement;
    accessor $hours: BlocksScrollable;
    accessor $minutes: BlocksScrollable;
    accessor $seconds: BlocksScrollable;
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
    attributeChangedCallback(attrName: MutableAttrs, oldValue: any, newValue: any): void;
    render(): void;
    clear(): void;
    _scrollToActive(): void;
    scrollToActive(): void;
    triggerChange(): void;
}
export {};
