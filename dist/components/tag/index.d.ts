import { Component } from '../Component.js';
declare type DomRef = {
    $layout: HTMLElement;
};
export declare class BlocksTag extends Component {
    ref: DomRef;
    static get observedAttributes(): string[];
    constructor();
    get closeable(): boolean;
    set closeable(value: boolean);
    get outline(): boolean;
    set outline(value: boolean);
    get size(): "small" | "large" | null;
    set size(value: "small" | "large" | null);
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
