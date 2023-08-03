import { BlPopup } from '../popup/index.js';
import { BlComponent } from '../component/Component.js';
export declare class BlTooltip extends BlComponent {
    #private;
    static get role(): string;
    static get observedAttributes(): readonly string[];
    accessor content: string;
    accessor openDelay: number;
    accessor closeDelay: number;
    accessor triggerMode: OneOf<['hover', 'click', 'manual']>;
    accessor $slot: HTMLSlotElement;
    $popup: BlPopup;
    constructor();
    get open(): boolean;
    set open(value: boolean);
    get anchorElement(): (() => Element) | undefined;
    set anchorElement(value: (() => Element) | undefined);
    render(): void;
}
