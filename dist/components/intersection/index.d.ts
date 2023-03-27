import { Component } from '../component/Component.js';
export declare class BlocksIntersection extends Component {
    static get observedAttributes(): string[];
    accessor rootMargin: string;
    accessor threshold: string;
    constructor();
    _root?: any;
    get root(): any;
    set root(value: any);
    get rootElement(): any;
    _flag?: any;
    _observer?: any;
    _initObserver(): void;
    _removeObserver(): void;
}
