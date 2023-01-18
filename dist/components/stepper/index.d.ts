import { Component } from '../Component.js';
export declare class BlocksSteps extends Component {
    ref: {
        $slot: HTMLSlotElement;
        $layout: HTMLElement;
    };
    static get observedAttributes(): string[];
    constructor();
    get direction(): "horizontal" | "vertical" | null;
    set direction(value: "horizontal" | "vertical" | null);
    get size(): "small" | "large" | null;
    set size(value: "small" | "large" | null);
    connectedCallback(): void;
    stepIndex($step: HTMLElement): number;
}
export declare class BlocksStep extends Component {
    ref: {
        $layout: HTMLElement;
        $icon: HTMLElement;
        $title: HTMLElement;
        $description: HTMLElement;
    };
    static get observedAttributes(): string[];
    constructor();
    get $stepper(): BlocksSteps;
    get stepTitle(): string | null;
    set stepTitle(value: string | null);
    get description(): string | null;
    set description(value: string | null);
    get icon(): string | null;
    set icon(value: string | null);
    get status(): "error" | "success" | "wait" | "process" | null;
    set status(value: "error" | "success" | "wait" | "process" | null);
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _renderContent($slotParent: HTMLElement, $default: HTMLElement | SVGElement | Text): void;
    _renderIcon(): void;
    _renderTitle(): void;
    _renderDescription(): void;
}
