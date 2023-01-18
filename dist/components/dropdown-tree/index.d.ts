import { ISelected, ISelectResultComponent } from '../../common/connectSelectable.js';
import { Component } from '../Component.js';
import { BlocksPopup, PopupOrigin } from '../popup/index.js';
import { BlocksTree } from '../tree/index.js';
export interface BlocksDropdownTree extends Component {
    _ref: {
        $slot: HTMLSlotElement;
        $popup: BlocksPopup;
        $tree: BlocksTree;
    };
    _hideTimer: number;
}
export declare class BlocksDropdownTree extends Component {
    #private;
    static get observedAttributes(): string[];
    constructor();
    _findResultComponent(): ISelectResultComponent | undefined;
    acceptSelected(value: ISelected[]): void;
    select(data: ISelected): void;
    deselect(data: ISelected): void;
    get triggerMode(): "click" | "hover";
    set triggerMode(value: "click" | "hover");
    get open(): boolean;
    set open(value: boolean);
    get origin(): PopupOrigin | null;
    set origin(value: PopupOrigin | null);
    get data(): object[];
    set data(value: object[]);
    get checked(): string[];
    set checked(ids: string[]);
    get checkedData(): import("../tree/index.js").NodeData[];
    set checkedData(value: import("../tree/index.js").NodeData[]);
    get disabledField(): string;
    set disabledField(value: string);
    get idField(): string;
    set idField(value: string);
    get labelField(): string | null;
    set labelField(value: string | null);
    get checkable(): boolean;
    set checkable(value: boolean);
    get multiple(): boolean;
    set multiple(value: boolean);
    getAnchorGetter(): (() => Element) | undefined;
    setAnchorGetter(value: () => Element): void;
    openPopup(): void;
    closePopup(): void;
    redrawList(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
