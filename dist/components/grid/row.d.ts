import { Component } from '../Component.js';
import type { NullableEnumAttr } from '../../decorators/attr.js';
export interface BlocksRow extends Component {
    _ref: {
        $slot: HTMLSlotElement;
    };
}
export declare class BlocksRow extends Component {
    static get observedAttributes(): string[];
    accessor gutter: number;
    accessor wrap: boolean;
    accessor align: NullableEnumAttr<['top', 'middle', 'bottom']>;
    accessor justify: NullableEnumAttr<[
        'start',
        'end',
        'center',
        'space-around',
        'space-between'
    ]>;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _renderGutter(): void;
}
