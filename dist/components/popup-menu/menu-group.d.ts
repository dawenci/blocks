import { BlNavMenu } from '../nav-menu/menu.js';
import { BlPopupMenu } from './menu.js';
import { BlComponent } from '../component/Component.js';
export declare class BlPopupMenuGroup extends BlComponent {
    #private;
    static get role(): string;
    accessor titleText: string;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor $head: HTMLElement;
    accessor $body: HTMLElement;
    constructor();
    _data: MenuGroup;
    get $hostMenu(): BlNavMenu | BlPopupMenu;
    set $hostMenu($menu: BlNavMenu | BlPopupMenu);
    get data(): MenuGroup;
    set data(value: MenuGroup);
    render(): void;
    clearActive(): void;
}
