import { ControlBox } from '../base-control-box/index.js';
declare const types: readonly ["primary", "danger", "warning", "success", "link"];
export interface BlocksButton extends ControlBox {
    _ref: ControlBox['_ref'] & {
        $content: HTMLSpanElement;
        $slot: HTMLSlotElement;
        $icon?: HTMLElement | null;
    };
    _observer: MutationObserver;
}
export declare class BlocksButton extends ControlBox {
    static get role(): string;
    static get observedAttributes(): string[];
    accessor icon: string | null;
    accessor block: boolean;
    accessor type: typeof types | null;
    accessor size: 'small' | 'large' | null;
    constructor();
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
