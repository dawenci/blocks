import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import { Component } from '../component/Component.js';
interface CountDownEventMap extends ComponentEventMap {
    start: CustomEvent<void>;
    stop: CustomEvent<void>;
    finish: CustomEvent<void>;
}
export interface BlocksCountdown extends Component {
    addEventListener<K extends keyof CountDownEventMap>(type: K, listener: ComponentEventListener<CountDownEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof CountDownEventMap>(type: K, listener: ComponentEventListener<CountDownEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksCountdown extends Component {
    #private;
    accessor value: number;
    accessor format: string;
    accessor $layout: HTMLElement;
    constructor();
    render(): void;
    run(): void;
    stop(): void;
}
export {};
