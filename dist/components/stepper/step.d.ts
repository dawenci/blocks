import type { BlSteps } from './steps.js';
import { BlComponent } from '../component/Component.js';
declare const statusEnum: string[];
export declare class BlStep extends BlComponent {
    accessor direction: MaybeOneOf<['horizontal', 'vertical']>;
    accessor stepTitle: string;
    accessor description: string;
    accessor icon: string;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor status: MaybeOneOf<typeof statusEnum>;
    accessor $layout: HTMLElement;
    accessor $icon: HTMLElement;
    accessor $title: HTMLElement;
    accessor $description: HTMLElement;
    constructor();
    get $stepper(): BlSteps;
    render(): void;
    _renderContent($slotParent: HTMLElement, $default: HTMLElement | SVGElement | Text): void;
    _renderIcon(): void;
    _renderTitle(): void;
    _renderDescription(): void;
}
export {};
