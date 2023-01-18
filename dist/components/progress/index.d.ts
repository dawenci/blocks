import { Component } from '../Component.js';
declare type DomRef = {
    $progress: HTMLElement;
    $value: HTMLElement;
};
export declare class BlocksProgress extends Component {
    ref: DomRef;
    static get observedAttributes(): string[];
    constructor();
    get value(): number | null;
    set value(value: number | null);
    get status(): string | null;
    set status(value: string | null);
    get percentage(): boolean;
    set percentage(value: boolean);
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void;
}
export {};
