import { Component } from '../Component.js';
export interface BlocksIcon extends Component {
    _ref: {
        $layout: HTMLElement;
    };
}
export declare class BlocksIcon extends Component {
    static get observedAttributes(): string[];
    accessor value: string | null;
    accessor fill: string | null;
    constructor();
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
