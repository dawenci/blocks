import { Component } from '../Component.js';
export declare class BlocksSlider extends Component {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    ref: {
        $layout: HTMLElement;
        $track: HTMLElement;
        $trackBg: HTMLElement;
        $point: HTMLButtonElement;
    };
    accessor shadowSize: number;
    accessor size: number;
    accessor min: number;
    accessor max: number;
    accessor disabled: boolean;
    accessor vertical: boolean;
    accessor round: number;
    constructor();
    get value(): number;
    set value(value: number);
    render(): void;
    _renderDisabled(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
