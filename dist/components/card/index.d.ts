import { Component } from '../Component.js';
import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js';
export interface BlocksCard extends Component {
    _ref: {
        $header: HTMLHeadElement;
        $body: HTMLDivElement;
    };
}
export declare class BlocksCard extends Component {
    static get observedAttributes(): string[];
    accessor shadow: NullableEnumAttr<['hover', 'always']>;
    accessor size: EnumAttrs['size'];
    constructor();
    connectedCallback(): void;
}
