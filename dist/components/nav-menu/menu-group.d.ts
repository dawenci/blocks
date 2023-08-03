import type { BlNavMenu } from './menu.js';
import './menu-item.js';
import { BlComponent } from '../component/Component.js';
export declare class BlNavMenuGroup extends BlComponent {
    #private;
    static get role(): string;
    accessor titleText: string;
    accessor horizontal: boolean;
    accessor collapse: boolean;
    accessor inline: boolean;
    accessor $head: HTMLElement;
    accessor $body: HTMLElement;
    private _data;
    constructor();
    get $hostMenu(): BlNavMenu;
    set $hostMenu($menu: BlNavMenu);
    get data(): MenuGroup;
    set data(value: MenuGroup);
    render(): void;
    clearActive(): void;
}
