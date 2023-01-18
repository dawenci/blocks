import { ComponentEventMap } from '../Component.js';
export interface WithOpenTransitionEventMap extends ComponentEventMap {
    opened: CustomEvent;
    closed: CustomEvent;
    'open-changed': CustomEvent<{
        value: boolean;
    }>;
}
export declare class WithOpenTransition extends HTMLElement {
    onOpen?: () => void;
    onClose?: () => void;
    static get observedAttributes(): string[];
    get open(): boolean;
    set open(value: boolean);
    get openTransitionName(): string;
    set openTransitionName(value: string);
    _onOpenAttributeChange(): void;
}
