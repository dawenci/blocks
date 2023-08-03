import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import { ISelected, ISelectListEventMap, ISelectResultComponent } from '../../common/connectSelectable.js';
import { BlList } from '../list/index.js';
import { BlPopup, PopupOrigin } from '../popup/index.js';
import { BlControl } from '../base-control/index.js';
export interface BlDropdownListEventMap extends BlComponentEventMap, ISelectListEventMap {
    'click-item': CustomEvent<{
        id: any;
    }>;
}
export interface BlDropdownList extends BlControl, ISelectResultComponent {
    $popup: BlPopup;
    $list: BlList;
    addEventListener<K extends keyof BlDropdownListEventMap>(type: K, listener: BlComponentEventListener<BlDropdownListEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlDropdownListEventMap>(type: K, listener: BlComponentEventListener<BlDropdownListEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlDropdownList extends BlControl implements ISelectResultComponent {
    #private;
    static get observedAttributes(): string[];
    accessor triggerMode: OneOf<['hover', 'click']>;
    accessor open: boolean;
    accessor origin: PopupOrigin | null;
    accessor disabledField: string;
    accessor idField: string;
    accessor labelField: string | null;
    accessor checkable: boolean;
    accessor multiple: boolean;
    accessor $slot: HTMLSlotElement;
    constructor();
    _findResultComponent(): ISelectResultComponent<any> | undefined;
    acceptSelected(value: ISelected[]): void;
    get data(): object[];
    set data(value: object[]);
    get checked(): string[];
    set checked(ids: string[]);
    get checkedData(): object[];
    set checkedData(value: object[]);
    getAnchorGetter(): (() => Element) | undefined;
    setAnchorGetter(value: () => Element): void;
    openPopup(): void;
    closePopup(): void;
    redrawList(): void;
}
