import { Component } from '../Component.js';
export interface BlocksBadge extends Component {
    _ref: {
        $slot: HTMLSlotElement;
        $badge: HTMLElement;
    };
}
export declare class BlocksBadge extends Component {
    accessor value: string;
    get $badge(): Element | null;
    constructor();
    render(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
