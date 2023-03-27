import type { EnumAttr } from '../../decorators/attr.js';
import { BlocksPopup } from '../popup/index.js';
import { Component } from '../component/Component.js';
export declare class BlocksTooltip extends Component {
    #private;
    static get observedAttributes(): readonly string[];
    accessor content: string;
    accessor openDelay: number;
    accessor closeDelay: number;
    accessor triggerMode: EnumAttr<['hover', 'click']>;
    accessor $slot: HTMLSlotElement;
    $popup: BlocksPopup;
    constructor();
    get open(): boolean;
    set open(value: boolean);
    render(): void;
}
