import '../loading/index.js';
import '../icon/index.js';
import { BlComponent } from '../component/Component.js';
export interface BlImage extends BlComponent {
    _status: 'init' | 'loading' | 'loaded' | 'error';
}
export declare class BlImage extends BlComponent {
    #private;
    static get role(): string;
    accessor alt: string | null;
    accessor fallback: string | null;
    accessor manual: boolean;
    accessor placeholder: string | null;
    accessor src: string | null;
    accessor fit: MaybeOneOf<['none', 'fill', 'contain', 'cover', 'scale-down']>;
    accessor $layout: HTMLElement;
    accessor $img: HTMLImageElement;
    accessor $placeholder: HTMLElement | null;
    accessor $fallback: HTMLElement | null;
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
