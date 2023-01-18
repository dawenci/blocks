import { Component } from '../Component.js';
export declare class BlocksBackTop extends Component {
    #private;
    ref: {
        $layout: HTMLElement;
    };
    static get observedAttributes(): string[];
    constructor();
    get duration(): number | null;
    set duration(value: number | null);
    get target(): string | Node | null;
    set target(value: string | null | Node | (() => Node));
    get targetElement(): Element | Window;
    get visibilityHeight(): number;
    set visibilityHeight(value: number);
    render(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
