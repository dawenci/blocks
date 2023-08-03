import { BlComponent } from '../component/Component.js';
export declare class BlDivider extends BlComponent {
    #private;
    static get role(): string;
    accessor vertical: boolean;
    accessor direction: MaybeOneOf<['vertical', 'horizontal']>;
    accessor $slot: HTMLSlotElement;
    constructor();
}
