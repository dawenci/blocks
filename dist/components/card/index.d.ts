import { Component } from '../Component.js';
export interface BlocksCard extends Component {
    _ref: {
        $header: HTMLHeadElement;
        $body: HTMLDivElement;
    };
}
export declare class BlocksCard extends Component {
    constructor();
    get shadow(): "always" | "hover" | null;
    set shadow(value: "always" | "hover" | null);
    connectedCallback(): void;
    static get observedAttributes(): string[];
}
