import { Component } from '../Component.js';
declare type DomRef = {
    $slot: HTMLSlotElement;
};
export declare class BlocksRow extends Component {
    ref: DomRef;
    constructor();
    get align(): "top" | "bottom" | "middle" | null;
    set align(value: "top" | "bottom" | "middle" | null);
    get gutter(): number;
    set gutter(value: number);
    get justify(): "center" | "end" | "start" | "space-around" | "space-between" | null;
    set justify(value: "center" | "end" | "start" | "space-around" | "space-between" | null);
    get wrap(): boolean;
    set wrap(value: boolean);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _renderGutter(): void;
    static get observedAttributes(): string[];
}
export {};
