import '../loading/index.js';
import '../icon/index.js';
import { Component, ComponentEventListener } from '../Component.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
type ImageTransformStates = Map<HTMLImageElement, {
    scale: number;
    rotate: number;
}>;
export type BlocksImageViewerEventMap = WithOpenTransitionEventMap;
export interface BlocksImageViewer extends Component, WithOpenTransition {
    _ref: {
        $slot: HTMLSlotElement;
        $mask: HTMLElement;
        $layout: HTMLElement;
        $toolbar: HTMLElement;
        $thumbnails: HTMLElement;
        $content: HTMLElement;
        $active: HTMLImageElement;
        $prev: HTMLButtonElement;
        $next: HTMLButtonElement;
        $closeButton: HTMLButtonElement;
        $rotateLeftButton: HTMLButtonElement;
        $rotateRightButton: HTMLButtonElement;
        $zoomInButton: HTMLButtonElement;
        $zoomOutButton: HTMLButtonElement;
    };
    imgMap: ImageTransformStates;
    addEventListener<K extends keyof BlocksImageViewerEventMap>(type: K, listener: ComponentEventListener<BlocksImageViewerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksImageViewerEventMap>(type: K, listener: ComponentEventListener<BlocksImageViewerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksImageViewer extends Component {
    static get observedAttributes(): string[];
    constructor();
    _imgs?: HTMLImageElement[];
    get imgs(): HTMLImageElement[];
    set imgs(value: HTMLImageElement[]);
    _activeImg?: HTMLImageElement;
    get activeImg(): HTMLImageElement;
    set activeImg(value: HTMLImageElement);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    zoomIn(): void;
    zoomOut(): void;
    rotateRight(): void;
    rotateLeft(): void;
    next(): void;
    prev(): void;
    render(): void;
    _renderCurrent(): void;
    _renderNavButton(): void;
    _renderToolbar(): void;
}
export {};
