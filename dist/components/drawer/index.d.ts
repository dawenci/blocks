import '../icon/index.js';
import '../modal-mask/index.js';
import { BlocksModalMask } from '../modal-mask/index.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import { ComponentEventListener } from '../Component.js';
import type { EnumAttr } from '../../decorators/attr.js';
type BlocksDrawerEventMap = WithOpenTransitionEventMap;
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
    static get observedAttributes(): string[];
    accessor capturefocus: boolean;
    accessor closeOnClickOutside: boolean;
    accessor closeOnEscape: boolean;
    accessor mask: boolean;
    accessor open: boolean;
    accessor name: string;
    accessor size: string;
    accessor placement: EnumAttr<['right', 'left', 'bottom', 'top']>;
    constructor();
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
}
export {};
