import { Component } from '../Component.js';
export declare class BlocksSlider extends Component {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    ref: {
        $layout: HTMLElement;
        $track: HTMLElement;
        $trackBg: HTMLElement;
        $point: HTMLButtonElement;
    };
    constructor();
    get value(): number;
    set value(value: number);
    get shadowSize(): number;
    set shadowSize(value: number);
    get size(): number;
    set size(value: number);
    get min(): number;
    set min(value: number);
    get max(): number;
    set max(value: number);
    get disabled(): boolean;
    set disabled(value: boolean);
    get vertical(): boolean;
    set vertical(value: boolean);
    get round(): number;
    set round(value: number);
    render(): void;
    _renderDisabled(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
