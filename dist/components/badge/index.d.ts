import { Component } from '../Component.js';
export declare class BlocksBadge extends Component {
    ref: {
        $slot: HTMLSlotElement;
        $badge: HTMLElement;
    };
    constructor();
    get value(): string;
    set value(value: string);
    render(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    static get observedAttributes(): string[];
}
