import type { BlComponentEventListener } from '../component/Component.js';
import type { WithOpenTransitionEventMap } from '../with-open-transition/index.js';
import '../button/index.js';
import '../icon/index.js';
import { BlComponent } from '../component/Component.js';
import { SetupFocusCapture } from '../setup-focus-capture/index.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
export interface WinEventMap extends WithOpenTransitionEventMap {
    'bl:resize': CustomEvent<{
        width: number;
        height: number;
    }>;
}
export interface BlWindow extends WithOpenTransition {
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
    addEventListener<K extends keyof WinEventMap>(type: K, listener: BlComponentEventListener<WinEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof WinEventMap>(type: K, listener: BlComponentEventListener<WinEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlWindow extends BlComponent {
    #private;
    accessor capturefocus: boolean;
    accessor restorefocus: boolean;
    accessor maximized: boolean;
    accessor minimized: boolean;
    accessor icon: string | null;
    accessor name: string | null;
    accessor actions: string;
    accessor $layout: HTMLElement;
    constructor();
    _focusCapture: SetupFocusCapture<this>;
}
