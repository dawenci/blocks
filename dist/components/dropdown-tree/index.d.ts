import { ISelected, ISelectResultComponent } from '../../common/connectSelectable.js';
import { Component } from '../Component.js';
import { BlocksPopup, PopupOrigin } from '../popup/index.js';
import { BlocksTree } from '../tree/index.js';
import type { EnumAttr } from '../../decorators/attr.js';
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
    accessor triggerMode: EnumAttr<['hover', 'click']>;
    accessor open: boolean;
    accessor origin: PopupOrigin | null;
    accessor disabledField: string;
    accessor idField: string;
    accessor labelField: string | null;
    accessor checkable: boolean;
    accessor multiple: boolean;
    constructor();
    _findResultComponent(): ISelectResultComponent | undefined;
    acceptSelected(value: ISelected[]): void;
    select(data: ISelected): void;
    deselect(data: ISelected): void;
    get data(): object[];
    set data(value: object[]);
    get checked(): string[];
    set checked(ids: string[]);
    get checkedData(): import("../tree/index.js").NodeData[];
    set checkedData(value: import("../tree/index.js").NodeData[]);
    getAnchorGetter(): (() => Element) | undefined;
    setAnchorGetter(value: () => Element): void;
    openPopup(): void;
    closePopup(): void;
    redrawList(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
