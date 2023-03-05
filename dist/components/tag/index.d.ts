import { Component } from '../Component.js';
import type { EnumAttrs } from '../../decorators/attr.js';
export interface BlocksTag extends Component {
    ref: {
        $layout: HTMLElement;
    };
}
export declare class BlocksTag extends Component {
    static get observedAttributes(): string[];
    accessor closeable: boolean;
    accessor outline: boolean;
    accessor size: EnumAttrs['size'];
    constructor();
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
