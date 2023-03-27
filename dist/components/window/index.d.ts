import type { ComponentEventListener } from '../component/Component.js';
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import '../button/index.js';
import '../icon/index.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
export interface BlocksWindow extends Control, WithOpenTransition {
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
    accessor $layout: HTMLElement;
    get actions(): string;
    set actions(value: string);
    constructor();
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
interface WinEventMap extends WithOpenTransitionEventMap {
    'bl:resize': CustomEvent<{
        width: number;
        height: number;
    }>;
}
export {};
