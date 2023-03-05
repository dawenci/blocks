import { Component } from '../Component.js';
import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js';
declare const statusEnum: string[];
export interface BlocksSteps extends Component {
    _ref: {
        $slot: HTMLSlotElement;
        $layout: HTMLElement;
    };
}
export declare class BlocksSteps extends Component {
    static get observedAttributes(): string[];
    accessor direction: NullableEnumAttr<['horizontal', 'vertical']>;
    accessor size: EnumAttrs['size'];
    constructor();
    connectedCallback(): void;
    stepIndex($step: HTMLElement): number;
}
export interface BlocksStep extends Component {
    _ref: {
        $layout: HTMLElement;
        $icon: HTMLElement;
        $title: HTMLElement;
        $description: HTMLElement;
    };
}
export declare class BlocksStep extends Component {
    static get observedAttributes(): string[];
    accessor stepTitle: string;
    accessor description: string;
    accessor icon: string;
    accessor status: NullableEnumAttr<typeof statusEnum>;
    constructor();
    get $stepper(): BlocksSteps;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _renderContent($slotParent: HTMLElement, $default: HTMLElement | SVGElement | Text): void;
    _renderIcon(): void;
    _renderTitle(): void;
    _renderDescription(): void;
}
export {};
