import { Component } from '../Component.js';
export interface BlocksBreadcrumb extends Component {
    _ref: {
        $slot: HTMLSlotElement;
    };
}
export declare class BlocksBreadcrumb extends Component {
    #private;
    static get observedAttributes(): string[];
    constructor();
    accessor separator: string;
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
