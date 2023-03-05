import { Component } from '../Component.js';
export interface BlocksColumn extends Component {
    _ref: {
        $slot: HTMLSlotElement;
    };
}
export declare class BlocksColumn extends Component {
    static get observedAttributes(): string[];
    accessor pull: number;
    accessor push: number;
    accessor span: number;
    accessor offset: number;
    constructor();
    connectedCallback(): void;
}
