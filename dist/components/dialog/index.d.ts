import '../button/index.js';
import '../modal-mask/index.js';
import { BlocksModalMask } from '../modal-mask/index.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import { Control } from '../base-control/index.js';
import { ComponentEventListener } from '../Component.js';
declare type BlocksDialogEventMap = WithOpenTransitionEventMap;
interface BlocksDialog extends Control, WithOpenTransition {
    _ref: Control['_ref'] & {
        $mask: BlocksModalMask;
        $firstFocusable?: HTMLButtonElement;
        $lastFocusable?: HTMLButtonElement;
        $close?: HTMLButtonElement;
    };
    addEventListener<K extends keyof BlocksDialogEventMap>(type: K, listener: ComponentEventListener<BlocksDialogEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksDialogEventMap>(type: K, listener: ComponentEventListener<BlocksDialogEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
declare class BlocksDialog extends Control {
    #private;
    static get role(): string;
    removeAfterClose: boolean;
    constructor();
    get mask(): boolean;
    set mask(value: boolean);
    get titleText(): string;
    set titleText(value: string);
    get closeable(): boolean;
    set closeable(value: boolean);
    get capturefocus(): boolean;
    set capturefocus(value: boolean);
    get appendToBody(): boolean;
    set appendToBody(value: boolean);
    render(): void;
    _captureFocus(): void;
    _stopCaptureFocus(): void;
    _updateVisible(): void;
    _renderClose(): void;
    _renderHeader(): void;
    _renderFooter(): void;
    _focus(): void;
    _blur(): void;
    connectedCallback(): void;
    _initDragEvents(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    static get observedAttributes(): string[];
}
export { BlocksDialog };
