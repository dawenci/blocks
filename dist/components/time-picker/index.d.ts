import { BlocksInput } from '../input/index.js';
import { BlocksTime } from '../time/index.js';
import { Component } from '../Component.js';
import { BlocksPopup } from '../popup/index.js';
export interface BlocksTimePicker extends Component {
    _ref: {
        $popup: BlocksPopup;
        $input: BlocksInput;
        $time: BlocksTime;
    };
}
export declare class BlocksTimePicker extends Component {
    #private;
    static get observedAttributes(): string[];
    _prevValue: {
        hour: number | null;
        minute: number | null;
        second: number | null;
    } | null;
    accessor hour: number | null;
    accessor minute: number | null;
    accessor second: number | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    _confirm(): void;
    _initClickOutside(): void;
    _destroyClickOutside(): void;
}
