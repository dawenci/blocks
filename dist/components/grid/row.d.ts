import { BlComponent } from '../component/Component.js';
export declare class BlRow extends BlComponent {
    #private;
    static get role(): string;
    accessor gutter: number;
    accessor wrap: boolean;
    accessor align: MaybeOneOf<['top', 'middle', 'bottom']>;
    accessor justify: MaybeOneOf<['start', 'end', 'center', 'space-around', 'space-between']>;
    accessor $slot: HTMLSlotElement;
    constructor();
}
