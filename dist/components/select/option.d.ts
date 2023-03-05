import { Component } from '../Component.js';
export declare class BlocksOption extends Component {
    #private;
    static get observedAttributes(): string[];
    accessor value: string | null;
    accessor label: string | null;
    accessor disabled: boolean;
    accessor selected: boolean;
    constructor();
    silentSelected(value: boolean): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
