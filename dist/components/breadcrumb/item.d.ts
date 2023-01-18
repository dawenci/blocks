import { Component } from '../Component.js';
export declare class BlocksBreadcrumbItem extends Component {
    ref: {
        $link: HTMLAnchorElement;
        $separator: HTMLDivElement;
    };
    constructor();
    get href(): string;
    set href(value: string);
    renderSeparator(separator: string): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    static get observedAttributes(): string[];
}
