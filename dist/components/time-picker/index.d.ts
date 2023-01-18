import { BlocksInput } from '../input/index.js';
import { BlocksTime } from '../time/index.js';
import { Component } from '../Component.js';
import { BlocksPopup } from '../popup/index.js';
export declare class BlocksTimePicker extends Component {
    #private;
    ref: {
        $popup: BlocksPopup;
        $input: BlocksInput;
        $time: BlocksTime;
    };
    _prevValue: {
        hour: number | null;
        minute: number | null;
        second: number | null;
    } | null;
    static get observedAttributes(): string[];
    constructor();
    get hour(): number | null;
    set hour(value: number | null);
    get minute(): number | null;
    set minute(value: number | null);
    get second(): number | null;
    set second(value: number | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    _confirm(): void;
    _initClickOutside(): void;
    _destroyClickOutside(): void;
}
