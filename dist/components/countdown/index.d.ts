import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
interface CountDownEventMap extends ComponentEventMap {
    start: CustomEvent<void>;
    stop: CustomEvent<void>;
    finish: CustomEvent<void>;
}
export interface BlocksCountdown extends Component {
    _ref: {
        $layout: HTMLElement;
    };
    addEventListener<K extends keyof CountDownEventMap>(type: K, listener: ComponentEventListener<CountDownEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof CountDownEventMap>(type: K, listener: ComponentEventListener<CountDownEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksCountdown extends Component {
    #private;
    static get observedAttributes(): string[];
    accessor value: number;
    accessor format: string;
    constructor();
    render(): void;
    run(): void;
    stop(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
