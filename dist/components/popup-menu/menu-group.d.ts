import { Component } from '../Component.js';
import { BlocksNavMenu } from '../nav-menu/menu.js';
import { BlocksPopupMenu } from './menu.js';
export declare class BlocksPopupMenuGroup extends Component {
    #private;
    static get observedAttributes(): string[];
    _data: MenuGroup;
    $head: HTMLElement;
    $body: HTMLElement;
    constructor();
    get $hostMenu(): BlocksNavMenu | BlocksPopupMenu;
    set $hostMenu($menu: BlocksNavMenu | BlocksPopupMenu);
    get titleText(): string;
    set titleText(value: string);
    get data(): MenuGroup;
    set data(value: MenuGroup);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    clearActive(): void;
}
