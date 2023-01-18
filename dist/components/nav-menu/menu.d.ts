import { Component } from '../Component.js';
import { BlocksNavMenuItem } from './menu-item.js';
export declare class BlocksNavMenu extends Component {
    static get role(): string;
    _data: (MenuItem | MenuGroup)[];
    $parentMenu?: BlocksNavMenu;
    $parentItem?: BlocksNavMenuItem;
    constructor();
    get enterDelay(): number;
    set enterDelay(value: number);
    get leaveDelay(): number;
    set leaveDelay(value: number);
    get size(): "small" | "large" | null;
    set size(value: "small" | "large" | null);
    get level(): number;
    set level(value: number);
    get submenu(): boolean;
    set submenu(value: boolean);
    get expand(): boolean;
    set expand(value: boolean);
    get inline(): boolean;
    set inline(value: boolean);
    get horizontal(): boolean;
    set horizontal(value: boolean);
    get collapse(): boolean;
    set collapse(value: boolean);
    get data(): (MenuItem | MenuGroup)[];
    set data(value: (MenuItem | MenuGroup)[]);
    get dark(): boolean;
    set dark(value: boolean);
    clearEnterTimer(): void;
    clearLeaveTimer(): void;
    clearActive(): void;
    horizontalRender(): void;
    verticalRender(): void;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    static get observedAttributes(): string[];
}
