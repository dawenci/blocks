import type { NullableEnumAttr } from '../../decorators/attr.js';
import '../loading/index.js';
import '../icon/index.js';
import { Component } from '../component/Component.js';
export interface BlocksImage extends Component {
    _ref: {
        $placeholder?: HTMLElement;
        $fallback?: HTMLElement;
    };
    _status: 'init' | 'loading' | 'loaded' | 'error';
}
export declare class BlocksImage extends Component {
    #private;
    accessor alt: string | null;
    accessor fallback: string | null;
    accessor manual: boolean;
    accessor placeholder: string | null;
    accessor src: string | null;
    accessor fit: NullableEnumAttr<['none', 'fill', 'contain', 'cover', 'scale-down']>;
    accessor $layout: HTMLElement;
    accessor $img: HTMLImageElement;
    constructor();
    _renderLoading(): void;
    _renderFail(): void;
    _renderSuccess(): void;
    _removePlaceholder(): void;
    _removeFallback(): void;
    _reset(): void;
    render(): void;
    load(): void;
}
