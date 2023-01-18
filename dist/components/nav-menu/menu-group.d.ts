import { Component } from '../Component.js';
import './menu-item.js';
import { BlocksNavMenu } from './menu.js';
export declare class BlocksNavMenuGroup extends Component {
    #private;
    private _data;
    $head: HTMLElement;
    $body: HTMLElement;
    constructor();
    get $hostMenu(): BlocksNavMenu;
    set $hostMenu($menu: BlocksNavMenu);
    get titleText(): string;
    set titleText(value: string);
    get horizontal(): boolean;
    set horizontal(value: boolean);
    get collapse(): boolean;
    set collapse(value: boolean);
    get data(): MenuGroup;
    set data(value: MenuGroup);
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    clearActive(): void;
    static get observedAttributes(): string[];
}
