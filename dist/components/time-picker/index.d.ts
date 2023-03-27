import '../popup/index.js';
import '../time/index.js';
import { BlocksInput } from '../input/index.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksTime } from '../time/index.js';
import { Component } from '../component/Component.js';
export interface BlocksTimePicker extends Component {
    _ref: {
        $popup: BlocksPopup;
        $time: BlocksTime;
    };
}
export declare class BlocksTimePicker extends Component {
    #private;
    static get observedAttributes(): string[];
    accessor hour: number | null;
    accessor minute: number | null;
    accessor second: number | null;
    accessor $input: BlocksInput;
    _prevValue: {
        hour: number | null;
        minute: number | null;
        second: number | null;
    } | null;
    constructor();
    render(): void;
    _confirm(): void;
}
