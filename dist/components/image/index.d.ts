import '../loading/index.js';
import '../icon/index.js';
import { Component } from '../Component.js';
import type { NullableEnumAttr } from '../../decorators/attr.js';
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
    static get observedAttributes(): readonly ["alt", "fallback", "fit", "manual", "placeholder", "src"];
    accessor alt: string | null;
    accessor fallback: string | null;
    accessor manual: boolean;
    accessor placeholder: string | null;
    accessor src: string | null;
    accessor fit: NullableEnumAttr<[
        'none',
        'fill',
        'contain',
        'cover',
        'scale-down'
    ]>;
    constructor();
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
