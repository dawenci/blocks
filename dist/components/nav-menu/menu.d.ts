import type { BlocksNavMenuItem } from './menu-item.js';
import type { EnumAttrs } from '../../decorators/attr.js';
import './menu-group.js';
import './menu-item.js';
import { Component } from '../component/Component.js';
export declare class BlocksNavMenu extends Component {
    static get role(): string;
    accessor enterDelay: number;
    accessor leaveDelay: number;
    accessor size: EnumAttrs['size'];
    accessor level: number;
    accessor submenu: boolean;
    accessor expand: boolean;
    accessor inline: boolean;
    accessor horizontal: boolean;
    accessor collapse: boolean;
    _data: (MenuItem | MenuGroup)[];
    $parentMenu?: BlocksNavMenu;
    $parentItem?: BlocksNavMenuItem;
    constructor();
    get data(): (MenuItem | MenuGroup)[];
    set data(value: (MenuItem | MenuGroup)[]);
    clearEnterTimer(): void;
    clearLeaveTimer(): void;
    clearActive(): void;
    horizontalRender(): void;
    verticalRender(): void;
    render(): void;
}
