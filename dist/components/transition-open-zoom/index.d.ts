import { Component } from '../Component.js';
export declare class BlocksTransitionOpenZoom extends Component {
    onOpen?: () => void;
    onClose?: () => void;
    static get observedAttributes(): string[];
    constructor();
    get open(): boolean;
    set open(value: boolean);
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
