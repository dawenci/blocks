import { BlComponent } from '../component/Component.js';
export declare class BlSteps extends BlComponent {
    #private;
    accessor direction: MaybeOneOf<['horizontal', 'vertical']>;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor $layout: HTMLElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    stepIndex($step: HTMLElement): number;
}
