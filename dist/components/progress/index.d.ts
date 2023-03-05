import { Component } from '../Component.js';
import { NullableEnumAttr } from '../../decorators/attr.js';
declare const status: string[];
export interface BlocksProgress extends Component {
    _ref: {
        $progress: HTMLElement;
        $value: HTMLElement;
    };
}
export declare class BlocksProgress extends Component {
    static get observedAttributes(): string[];
    accessor value: number | null;
    accessor status: NullableEnumAttr<typeof status>;
    accessor percentage: boolean;
    constructor();
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void;
}
export {};
