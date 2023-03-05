import { Component } from '../Component.js';
import type { EnumAttr } from '../../decorators/attr.js';
export declare class BlocksTooltip extends Component {
    static get observedAttributes(): string[];
    private $slot;
    private $popup;
    private _enterTimer?;
    private _leaveTimer?;
    private _clearClickOutside?;
    accessor content: string;
    accessor openDelay: number;
    accessor closeDelay: number;
    accessor triggerMode: EnumAttr<['hover', 'click']>;
    constructor();
    get open(): boolean;
    set open(value: boolean);
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _initClickOutside(): void;
    _destroyClickOutside(): void;
}
