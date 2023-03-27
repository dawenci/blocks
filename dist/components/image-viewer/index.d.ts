import type { ComponentEventListener } from '../component/Component.js';
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import '../icon/index.js';
import '../loading/index.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
type ImageTransformStates = Map<HTMLImageElement, {
    scale: number;
    rotate: number;
}>;
export type BlocksImageViewerEventMap = WithOpenTransitionEventMap;
export interface BlocksImageViewer extends Control, WithOpenTransition {
    imgMap: ImageTransformStates;
    addEventListener<K extends keyof BlocksImageViewerEventMap>(type: K, listener: ComponentEventListener<BlocksImageViewerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksImageViewerEventMap>(type: K, listener: ComponentEventListener<BlocksImageViewerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksImageViewer extends Control {
    #private;
    accessor closeOnClickMask: boolean;
    accessor closeOnPressEscape: boolean;
    accessor $layout: HTMLElement;
    accessor $slot: HTMLSlotElement;
    accessor $mask: HTMLElement;
    accessor $toolbar: HTMLElement;
    accessor $thumbnails: HTMLElement;
    accessor $content: HTMLElement;
    accessor $active: HTMLImageElement;
    accessor $prev: HTMLButtonElement;
    accessor $next: HTMLButtonElement;
    accessor $closeButton: HTMLButtonElement;
    accessor $rotateLeftButton: HTMLButtonElement;
    accessor $rotateRightButton: HTMLButtonElement;
    accessor $zoomInButton: HTMLButtonElement;
    accessor $zoomOutButton: HTMLButtonElement;
    constructor();
    _imgs?: HTMLImageElement[];
    get imgs(): HTMLImageElement[];
    set imgs(value: HTMLImageElement[]);
    _activeImg?: HTMLImageElement;
    get activeImg(): HTMLImageElement;
    set activeImg(value: HTMLImageElement);
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
