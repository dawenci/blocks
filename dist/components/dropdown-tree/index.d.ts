import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import type { EnumAttr } from '../../decorators/attr.js';
import { ISelected, ISelectListEventMap, ISelectResultComponent } from '../../common/connectSelectable.js';
import { BlocksPopup, PopupOrigin } from '../popup/index.js';
import { BlocksTree } from '../tree/index.js';
import { Control } from '../base-control/index.js';
interface BlocksDropdownTreeEventMap extends ComponentEventMap, ISelectListEventMap {
    'click-item': CustomEvent<{
        id: any;
    }>;
}
export interface BlocksDropdownTree extends Control, ISelectResultComponent {
    $popup: BlocksPopup;
    $tree: BlocksTree;
    addEventListener<K extends keyof BlocksDropdownTreeEventMap>(type: K, listener: ComponentEventListener<BlocksDropdownTreeEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksDropdownTreeEventMap>(type: K, listener: ComponentEventListener<BlocksDropdownTreeEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksDropdownTree extends Control implements ISelectResultComponent {
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
    accessor $slot: HTMLSlotElement;
    constructor();
    _findResultComponent(): ISelectResultComponent | undefined;
    acceptSelected(value: ISelected[]): void;
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
}
export {};
