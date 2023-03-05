import { BlocksPopup } from '../popup/index.js';
import { BlocksPopupMenuItem } from './menu-item.js';
import { BlocksNavMenu } from '../nav-menu/menu.js';
import { BlocksNavMenuItem } from '../nav-menu/menu-item.js';
import type { EnumAttrs } from '../../decorators/attr.js';
export declare class BlocksPopupMenu extends BlocksPopup {
    static get observedAttributes(): string[];
    private _data;
    private _leaveTimer?;
    private _enterTimer?;
    private _clearClickOutside?;
    $parentItem?: BlocksPopupMenuItem | BlocksNavMenuItem;
    $parentMenu?: BlocksPopupMenu | BlocksNavMenu;
    accessor enterDelay: number;
    accessor leaveDelay: number;
    accessor size: EnumAttrs['size'];
    accessor level: number;
    constructor();
    get data(): (MenuItem | MenuGroup)[];
    set data(value: (MenuItem | MenuGroup)[]);
    clearEnterTimer(): void;
    clearLeaveTimer(): void;
    enter(): void;
    leave(): void;
    closeAll(): void;
    clearActive(): void;
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _initClickOutside(): void;
    _destroyClickOutside(): void;
}
