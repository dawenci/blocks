import { Component } from '../Component.js';
export interface BlocksRangeSlider extends Component {
    ref: {
        $layout: HTMLElement;
        $track: HTMLElement;
        $trackBg: HTMLElement;
        $point: HTMLButtonElement;
        $point2: HTMLButtonElement;
        $range: HTMLElement;
    };
}
export declare class BlocksRangeSlider extends Component {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    accessor shadowSize: number;
    accessor size: number;
    accessor min: number;
    accessor max: number;
    accessor disabled: boolean;
    accessor vertical: boolean;
    accessor round: number;
    constructor();
    get value(): [number, number];
    set value(value: [number, number]);
    render(): void;
    _renderDisabled(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
