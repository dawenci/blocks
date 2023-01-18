import { Component } from '../Component.js';
export declare class BlocksOption extends Component {
    #private;
    constructor();
    get value(): string | null;
    set value(value: string | null);
    get label(): string;
    set label(value: string);
    get disabled(): boolean;
    set disabled(value: boolean);
    get selected(): boolean;
    set selected(value: boolean);
    silentSelected(value: boolean): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    static get observedAttributes(): string[];
}
