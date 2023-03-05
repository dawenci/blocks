import { Component } from '../Component.js';
export declare class BlocksTransitionOpenZoom extends Component {
    onOpen?: () => void;
    onClose?: () => void;
    static get observedAttributes(): string[];
    accessor open: boolean;
    constructor();
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
