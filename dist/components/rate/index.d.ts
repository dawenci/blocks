import { Component } from '../Component.js';
export interface BlocksRate extends Component {
    ref: {
        $layout: HTMLElement;
    };
}
export declare class BlocksRate extends Component {
    static get observedAttributes(): string[];
    _hoverValue?: number;
    accessor clearable: boolean;
    accessor half: boolean;
    accessor resultMode: boolean;
    constructor();
    get value(): any;
    set value(value: any);
    updateSelect(): void;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
