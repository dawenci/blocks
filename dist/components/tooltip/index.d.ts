import { Component } from '../Component.js';
export declare class BlocksTooltip extends Component {
    static get observedAttributes(): string[];
    private $slot;
    private $popup;
    private _enterTimer?;
    private _leaveTimer?;
    private _clearClickOutside?;
    constructor();
    get content(): string;
    set content(value: string);
    get openDelay(): number;
    set openDelay(value: number);
    get closeDelay(): number;
    set closeDelay(value: number);
    get open(): boolean;
    set open(value: boolean);
    get triggerMode(): "click" | "hover";
    set triggerMode(value: "click" | "hover");
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _initClickOutside(): void;
    _destroyClickOutside(): void;
}
