import { ControlBox } from '../base-control-box/index.js';
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
    constructor();
    get block(): boolean;
    set block(value: boolean);
    get type(): "link" | "success" | "primary" | "danger" | "warning" | null;
    set type(value: "link" | "success" | "primary" | "danger" | "warning" | null);
    get size(): "small" | "large" | null;
    set size(value: "small" | "large" | null);
    get icon(): string | null;
    set icon(value: string | null);
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
