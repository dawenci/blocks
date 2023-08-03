import type { BlNavMenuItem } from './menu-item.js';
import type { BlPopup } from '../popup/popup.js';
import './menu-group.js';
import './menu-item.js';
import '../tooltip/index.js';
import { BlComponent } from '../component/Component.js';
export interface BlNavMenu extends BlComponent {
    $tooltip?: BlPopup;
}
export declare class BlNavMenu extends BlComponent {
    #private;
    static get role(): string;
    accessor enterDelay: number;
    accessor leaveDelay: number;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor level: number;
    accessor submenu: boolean;
    accessor expand: boolean;
    accessor inline: boolean;
    accessor horizontal: boolean;
    accessor collapse: boolean;
    _data: (MenuItem | MenuGroup)[];
    $parentMenu?: BlNavMenu;
    $parentItem?: BlNavMenuItem;
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
