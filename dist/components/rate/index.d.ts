import { Component } from '../Component.js';
declare type DomRef = {
    $layout: HTMLElement;
};
export declare class BlocksRate extends Component {
    ref: DomRef;
    _hoverValue?: number;
    static get observedAttributes(): string[];
    constructor();
    get clearable(): boolean;
    set clearable(value: boolean);
    get value(): any;
    set value(value: any);
    get half(): boolean;
    set half(value: boolean);
    get resultMode(): boolean;
    set resultMode(value: boolean);
    updateSelect(): void;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
