import type { BlCloseButton } from '../close-button/index.js';
import '../close-button/index.js';
import { BlComponent } from '../component/Component.js';
declare const types: readonly ["primary", "danger", "warning", "success"];
export declare class BlTag extends BlComponent {
    #private;
    accessor round: boolean;
    accessor type: (typeof types)[number];
    accessor closeable: boolean;
    accessor outline: boolean;
    accessor size: MaybeOneOf<['small' | 'large']>;
    accessor $layout: HTMLElement;
    accessor $close: BlCloseButton;
    constructor();
}
export {};
