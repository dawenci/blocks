import { Component } from '../component/Component.js';
export declare class BlocksSplitterPane extends Component {
    static get observedAttributes(): string[];
    accessor basis: number;
    accessor grow: number;
    accessor shrink: number;
    accessor max: number;
    accessor min: number;
    collapseSize?: number;
    constructor();
    _size?: number | null;
    get size(): number;
    set size(value: number);
    private getSplitter;
    updateStyle(): void;
    collapse(): void;
    expand(): void;
}
