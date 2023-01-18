import { Component } from '../Component.js';
export declare class BlocksOptGroup extends Component {
    static get observedAttributes(): string[];
    constructor();
    get label(): string | null;
    set label(value: string | null);
    get disabled(): boolean;
    set disabled(value: boolean);
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
