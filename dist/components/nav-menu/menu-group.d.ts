import { Component } from '../Component.js';
import './menu-item.js';
import { BlocksNavMenu } from './menu.js';
export declare class BlocksNavMenuGroup extends Component {
    #private;
    static get observedAttributes(): string[];
    private _data;
    $head: HTMLElement;
    $body: HTMLElement;
    accessor titleText: string;
    accessor horizontal: boolean;
    accessor collapse: boolean;
    constructor();
    get $hostMenu(): BlocksNavMenu;
    set $hostMenu($menu: BlocksNavMenu);
    get data(): MenuGroup;
    set data(value: MenuGroup);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    clearActive(): void;
}
