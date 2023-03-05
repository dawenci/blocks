import '../button/index.js';
import '../icon/index.js';
import { ComponentEventListener } from '../Component.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition, WithOpenTransitionEventMap } from '../with-open-transition/index.js';
interface WinEventMap extends WithOpenTransitionEventMap {
    'bl:resize': CustomEvent<{
        width: number;
        height: number;
    }>;
}
export interface BlocksWindow extends Control, WithOpenTransition {
    _ref: Control['_ref'] & {
        $header: HTMLElement;
        $body: HTMLElement;
        $content: HTMLElement;
        $statusBar: HTMLElement;
        $statusBarSlot: HTMLSlotElement;
        $actions: HTMLElement;
        $closeButton: HTMLButtonElement;
        $maximizeButton: HTMLButtonElement;
        $minimizeButton: HTMLButtonElement;
        $icon: HTMLElement;
        $name: HTMLElement;
        $firstFocusable?: HTMLButtonElement;
        $lastFocusable?: HTMLButtonElement;
    };
    addEventListener<K extends keyof WinEventMap>(type: K, listener: ComponentEventListener<WinEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof WinEventMap>(type: K, listener: ComponentEventListener<WinEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksWindow extends Control {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    accessor capturefocus: boolean;
    accessor maximized: boolean;
    accessor minimized: boolean;
    accessor icon: string | null;
    accessor name: string | null;
    constructor();
    get actions(): string;
    set actions(value: string);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
