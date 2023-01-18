import { Component } from '../Component.js';
export declare class BlocksIntersection extends Component {
    static get observedAttributes(): string[];
    constructor();
    _root?: any;
    get root(): any;
    set root(value: any);
    get rootElement(): any;
    get rootMargin(): string;
    set rootMargin(value: string);
    get threshold(): string;
    set threshold(value: string);
    _flag?: any;
    _observer?: any;
    _initObserver(): void;
    _removeObserver(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
