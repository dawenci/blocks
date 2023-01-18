import '../loading/index.js';
import '../icon/index.js';
import { Component } from '../Component.js';
export interface BlocksImage extends Component {
    _ref: {
        $layout: HTMLElement;
        $img: HTMLImageElement;
        $placeholder?: HTMLElement;
        $fallback?: HTMLElement;
    };
    _status: 'init' | 'loading' | 'loaded' | 'error';
}
export declare class BlocksImage extends Component {
    #private;
    static get observedAttributes(): readonly ["alt", "fallback", "fit", "manual", "placeholder", "src"];
    constructor();
    get alt(): string | null;
    set alt(value: string | null);
    get fallback(): string | null;
    set fallback(value: string | null);
    get manual(): boolean;
    set manual(value: boolean);
    get placeholder(): string | null;
    set placeholder(value: string | null);
    get fit(): "fill" | "none" | "contain" | "cover" | "scale-down" | null;
    set fit(value: "fill" | "none" | "contain" | "cover" | "scale-down" | null);
    get src(): string | null;
    set src(value: string | null);
    _renderLoading(): void;
    _renderFail(): void;
    _renderSuccess(): void;
    _removePlaceholder(): void;
    _removeFallback(): void;
    _reset(): void;
    render(): void;
    load(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
