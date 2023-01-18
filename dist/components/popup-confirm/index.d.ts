import '../popup/index.js';
import { Component } from '../Component.js';
export declare class BlocksPopupConfirm extends Component {
    private $popup;
    private $message;
    private $confirm;
    private $cancel;
    confirm?: () => Promise<any>;
    cancel?: () => Promise<any>;
    static get observedAttributes(): string[];
    constructor();
    get icon(): string;
    set icon(value: string);
    get message(): string;
    set message(value: string);
    get origin(): import("../popup/index.js").PopupOrigin;
    set origin(value: import("../popup/index.js").PopupOrigin);
    get open(): boolean;
    set open(value: boolean);
    _confirm(): void;
    _cancel(): void;
    renderIcon(): void;
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
