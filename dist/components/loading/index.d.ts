import { Component } from '../Component.js';
export interface BlocksLoading extends Component {
    _ref: {
        $layout: HTMLElement;
        $icon?: SVGElement;
    };
}
export declare class BlocksLoading extends Component {
    constructor();
    render(): void;
    connectedCallback(): void;
}
