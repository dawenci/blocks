import { BlocksNavMenu } from '../nav-menu/menu.js';
import { BlocksPopupMenu } from './menu.js';
import { Component } from '../component/Component.js';
export declare class BlocksPopupMenuGroup extends Component {
    #private;
    accessor titleText: string;
    _data: MenuGroup;
    $head: HTMLElement;
    $body: HTMLElement;
    constructor();
    get $hostMenu(): BlocksNavMenu | BlocksPopupMenu;
    set $hostMenu($menu: BlocksNavMenu | BlocksPopupMenu);
    get data(): MenuGroup;
    set data(value: MenuGroup);
    render(): void;
    clearActive(): void;
}
