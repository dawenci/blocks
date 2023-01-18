import { ClearableControlBox } from '../base-clearable-control-box/index.js';
export interface BlocksResult extends ClearableControlBox {
    _ref: ClearableControlBox['_ref'] & {
        $content: HTMLElement;
        $slot: HTMLSlotElement;
    };
}
export declare class BlocksResult extends ClearableControlBox {
    static get observedAttributes(): string[];
    constructor();
    get size(): "small" | "large" | null;
    set size(value: "small" | "large" | null);
}
