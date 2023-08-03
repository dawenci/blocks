import '../popup/index.js';
import { BlPopup } from '../popup/index.js';
import { BlButton } from '../button/index.js';
import { BlComponent } from '../component/Component.js';
export interface BlPopupConfirm extends BlComponent {
    $popup: BlPopup;
    $message: HTMLElement;
    $confirm: BlButton;
    $cancel: BlButton;
    onConfirm?: () => Promise<any>;
    onCancel?: () => Promise<any>;
}
export declare class BlPopupConfirm extends BlComponent {
    #private;
    static get observedAttributes(): string[];
    accessor icon: string;
    accessor message: string;
    accessor open: boolean;
    constructor();
    confirm(): Promise<void>;
    cancel(): Promise<void>;
    _renderIcon(): void;
    render(): void;
}
