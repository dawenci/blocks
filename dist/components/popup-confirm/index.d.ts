import type { EnumAttr } from '../../decorators/attr.js';
import '../popup/index.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksButton } from '../button/index.js';
import { Component } from '../component/Component.js';
import { PopupOrigin } from '../popup/index.js';
declare const originArray: PopupOrigin[];
export interface BlocksPopupConfirm extends Component {
    $popup: BlocksPopup;
    $message: HTMLElement;
    $confirm: BlocksButton;
    $cancel: BlocksButton;
    confirm?: () => Promise<any>;
    cancel?: () => Promise<any>;
}
export declare class BlocksPopupConfirm extends Component {
    #private;
    static get observedAttributes(): ("message" | "origin" | "open" | "icon")[];
    accessor icon: string;
    accessor message: string;
    accessor open: boolean;
    accessor origin: EnumAttr<typeof originArray>;
    constructor();
    _renderIcon(): void;
    render(): void;
}
export {};
