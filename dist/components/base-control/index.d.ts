import { Component } from '../Component.js';
export interface Control extends Component {
    _ref: {
        $layout: HTMLDivElement;
    };
}
export declare class Control extends Component {
    #private;
    static get observedAttributes(): string[];
    constructor();
    get internalTabIndex(): `${number}` | null;
    set internalTabIndex(value: `${number}` | null);
    get disabled(): boolean;
    set disabled(value: boolean);
    _renderDisabled(): void;
    _appendStyle($style: HTMLStyleElement): void;
    _appendContent<T extends HTMLElement | DocumentFragment>($el: T): T;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
