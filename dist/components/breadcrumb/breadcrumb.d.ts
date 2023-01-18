import { Component } from '../Component.js';
export interface BlocksBreadcrumb extends Component {
    _ref: {
        $slot: HTMLSlotElement;
    };
}
export declare class BlocksBreadcrumb extends Component {
    #private;
    constructor();
    get separator(): string;
    set separator(value: string);
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    static get observedAttributes(): string[];
}
