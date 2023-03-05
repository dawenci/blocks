import { Component } from '../Component.js';
export declare class BlocksOptGroup extends Component {
    static get observedAttributes(): string[];
    accessor label: string;
    accessor disabled: boolean;
    constructor();
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
