import type { BlIcon } from '../icon/index.js';
import type { BlNavMenu } from './menu.js';
import '../icon/index.js';
import '../popup-menu/index.js';
import { BlPopupMenu } from '../popup-menu/index.js';
import { BlComponent } from '../component/Component.js';
export declare class BlNavMenuItem extends BlComponent {
    #private;
    static get role(): string;
    accessor expand: boolean;
    accessor active: boolean;
    accessor disabled: boolean;
    accessor link: boolean;
    accessor $layout: HTMLElement;
    accessor $label: HTMLElement;
    accessor $icon: BlIcon;
    accessor $arrow: HTMLElement;
    private _leaveTimer?;
    private _enterTimer?;
    private _data;
    constructor();
    get $hostMenu(): BlNavMenu;
    set $hostMenu($menu: BlNavMenu);
    get $submenu(): BlNavMenu | BlPopupMenu | undefined;
    set $submenu($menu: BlNavMenu | BlPopupMenu | undefined);
    get $parentMenu(): BlNavMenu | undefined;
    set $parentMenu($menu: BlNavMenu | undefined);
    get $rootMenu(): BlNavMenu;
    get isInlineMode(): boolean;
    get isCollapseMode(): boolean;
    get hasSubmenu(): boolean;
    get data(): MenuItem;
    set data(value: MenuItem);
    render(): void;
    clearEnterTimer(): void;
    clearLeaveTimer(): void;
    clearActive(): void;
}
