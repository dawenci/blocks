import '../button/index.js';
import { Component } from '../Component.js';
export interface BlocksButtonGroup extends Component {
    _ref: {
        $slot: HTMLSlotElement;
    };
}
export declare class BlocksButtonGroup extends Component {
    constructor();
    connectedCallback(): void;
    render(): void;
}
