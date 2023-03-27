import type { BlocksNavMenu } from './menu.js';
import './menu-item.js';
import { Component } from '../component/Component.js';
export declare class BlocksNavMenuGroup extends Component {
    #private;
    accessor titleText: string;
    accessor horizontal: boolean;
    accessor collapse: boolean;
    accessor $head: HTMLElement;
    accessor $body: HTMLElement;
    private _data;
    constructor();
    get $hostMenu(): BlocksNavMenu;
    set $hostMenu($menu: BlocksNavMenu);
    get data(): MenuGroup;
    set data(value: MenuGroup);
    render(): void;
    clearActive(): void;
}
