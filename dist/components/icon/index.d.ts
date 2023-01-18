import { Component } from '../Component.js';
declare type DomRef = {
    $layout: HTMLElement;
};
export declare class BlocksIcon extends Component {
    ref: DomRef;
    static get observedAttributes(): string[];
    constructor();
    render(): void;
    get value(): string | null;
    set value(value: string | null);
    get fill(): string | null;
    set fill(value: string | null);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
