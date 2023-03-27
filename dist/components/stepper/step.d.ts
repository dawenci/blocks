import type { NullableEnumAttr } from '../../decorators/attr.js';
import type { BlocksSteps } from './steps.js';
import { Component } from '../component/Component.js';
declare const statusEnum: string[];
export declare class BlocksStep extends Component {
    accessor direction: NullableEnumAttr<['horizontal', 'vertical']>;
    accessor stepTitle: string;
    accessor description: string;
    accessor icon: string;
    accessor status: NullableEnumAttr<typeof statusEnum>;
    accessor $layout: HTMLElement;
    accessor $icon: HTMLElement;
    accessor $title: HTMLElement;
    accessor $description: HTMLElement;
    constructor();
    get $stepper(): BlocksSteps;
    render(): void;
    _renderContent($slotParent: HTMLElement, $default: HTMLElement | SVGElement | Text): void;
    _renderIcon(): void;
    _renderTitle(): void;
    _renderDescription(): void;
}
export {};
