import '../../components/icon/index.js';
import '../../components/popup/index.js';
import { BlIcon } from '../../components/icon/index.js';
import { BlNavMenu } from '../nav-menu/menu.js';
import { BlPopupMenu } from './menu.js';
import { BlComponent } from '../component/Component.js';
export declare class BlPopupMenuItem extends BlComponent {
    #private;
    static get role(): string;
    accessor disabled: boolean;
    accessor link: boolean;
    accessor active: boolean;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor $layout: HTMLElement;
    accessor $label: HTMLElement;
    accessor $icon: BlIcon;
    accessor $arrow: HTMLElement;
    _enterTimer?: ReturnType<typeof setTimeout>;
    _leaveTimer?: ReturnType<typeof setTimeout>;
    constructor();
    get $submenu(): BlPopupMenu | undefined;
    set $submenu($menu: BlPopupMenu | undefined);
    get $hostMenu(): BlNavMenu | BlPopupMenu | undefined;
    set $hostMenu($menu: BlNavMenu | BlPopupMenu | undefined);
    get $rootMenu(): BlNavMenu | BlPopupMenu;
    get hasSubmenu(): boolean;
    get isLeaf(): boolean;
    _data?: any;
    get data(): any;
    set data(value: any);
    render(): void;
    clearEnterTimer(): void;
    clearLeaveTimer(): void;
    clearActive(): void;
}
