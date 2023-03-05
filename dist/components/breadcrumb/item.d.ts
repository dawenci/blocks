import { Component } from '../Component.js';
export interface BlocksBreadcrumbItem extends Component {
    _ref: {
        $link: HTMLAnchorElement;
        $separator: HTMLDivElement;
    };
}
export declare class BlocksBreadcrumbItem extends Component {
    static get observedAttributes(): string[];
    constructor();
    accessor href: string;
    _renderSeparator(separator: string): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
