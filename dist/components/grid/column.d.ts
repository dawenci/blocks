import { Component } from '../Component.js';
declare type DomRef = {
    $slot: HTMLSlotElement;
};
export declare class BlocksColumn extends Component {
    ref: DomRef;
    static get observedAttributes(): string[];
    constructor();
    get pull(): number | null;
    set pull(value: number | null);
    get push(): number | null;
    set push(value: number | null);
    get span(): number | null;
    set span(value: number | null);
    get offset(): number | null;
    set offset(value: number | null);
    connectedCallback(): void;
}
export {};
