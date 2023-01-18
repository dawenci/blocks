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
declare class BlocksWindow extends Control {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    constructor();
    get actions(): string;
    set actions(value: string);
    get capturefocus(): boolean;
    set capturefocus(value: boolean);
    get icon(): string | null;
    set icon(value: string | null);
    get maximized(): boolean;
    set maximized(value: boolean);
    get minimized(): boolean;
    set minimized(value: boolean);
    get name(): string | null;
    set name(value: string | null);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    addEventListener<K extends keyof WinEventMap>(type: K, listener: ComponentEventListener<WinEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof WinEventMap>(type: K, listener: ComponentEventListener<WinEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
interface BlocksWindow extends Control, WithOpenTransition {
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
}
export { BlocksWindow };
