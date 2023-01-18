import '../icon/index.js';
import '../modal-mask/index.js';
import { BlocksModalMask } from '../modal-mask/index.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import { ComponentEventListener } from '../Component.js';
declare type BlocksDrawerEventMap = WithOpenTransitionEventMap;
export interface BlocksDrawer extends Control, WithOpenTransition {
    _ref: Control['_ref'] & {
        $name: HTMLElement;
        $close: HTMLButtonElement;
        $mask?: BlocksModalMask;
        $firstFocusable?: HTMLButtonElement;
        $lastFocusable?: HTMLButtonElement;
    };
    addEventListener<K extends keyof BlocksDrawerEventMap>(type: K, listener: ComponentEventListener<BlocksDrawerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksDrawerEventMap>(type: K, listener: ComponentEventListener<BlocksDrawerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksDrawer extends Control {
    #private;
    constructor();
    get capturefocus(): boolean;
    set capturefocus(value: boolean);
    get closeOnClickOutside(): boolean;
    set closeOnClickOutside(value: boolean);
    get closeOnEscape(): boolean;
    set closeOnEscape(value: boolean);
    get mask(): boolean;
    set mask(value: boolean);
    get name(): string | null;
    set name(value: string | null);
    get open(): boolean;
    set open(value: boolean);
    get placement(): "left" | "top" | "bottom" | "right";
    set placement(value: "left" | "top" | "bottom" | "right");
    get size(): string;
    set size(value: string);
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _initKeydown(): void;
    _destroyKeydown(): void;
    _initClickOutside(): void;
    _destroyClickOutside(): void;
    _ensureMask(): BlocksModalMask;
    _captureFocus(): void;
    _stopCaptureFocus(): void;
    static get observedAttributes(): string[];
}
export {};
