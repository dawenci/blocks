import type { BlComponentEventMap, BlComponentEventListener } from '../component/Component.js';
import { BlComponent } from '../component/Component.js';
export interface BlIntersectionEventMap extends BlComponentEventMap {
    intersection: CustomEvent<{
        entries: IntersectionObserverEntry[];
        observer: IntersectionObserver;
    }>;
}
export interface BlIntersection extends BlComponent {
    addEventListener<K extends keyof BlIntersectionEventMap>(type: K, listener: BlComponentEventListener<BlIntersectionEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlIntersectionEventMap>(type: K, listener: BlComponentEventListener<BlIntersectionEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlIntersection extends BlComponent {
    #private;
    static get observedAttributes(): string[];
    accessor rootMargin: string;
    accessor rootSelector: string | null;
    accessor threshold: number;
    accessor rootElement: (() => Element) | undefined;
    constructor();
    _getRootElement(): Element | null;
    _flag?: any;
    _observer?: any;
    _initObserver(): void;
    _removeObserver(): void;
}
