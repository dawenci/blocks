import { BlocksPopup } from '../popup/index.js';
import { BlocksColor } from '../color/index.js';
import { Component } from '../Component.js';
export interface BlocksColorPicker extends Component {
    _ref: {
        $result: HTMLDivElement;
        $icon: HTMLElement;
        $popup: BlocksPopup;
        $color: BlocksColor;
    };
}
export declare class BlocksColorPicker extends Component {
    #private;
    static get observedAttributes(): string[];
    constructor();
    get disabled(): boolean;
    set disabled(value: boolean);
    get hex(): string | null;
    set hex(value: string | null);
    get hsl(): [number, number, number];
    set hsl(value: [number, number, number]);
    get hsla(): number[];
    set hsla(value: number[]);
    get hsv(): number[];
    set hsv(value: number[]);
    get hsva(): number[];
    set hsva(value: number[]);
    get rgb(): number[];
    set rgb(value: number[]);
    get rgba(): [number, number, number, number];
    set rgba(value: [number, number, number, number]);
    get value(): string | null;
    set value(value: string | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    toHexString(): string | null;
    toRgbString(): string;
    toRgbaString(): string;
    toHslString(): string;
    toHslaString(): string;
    toHsvString(): string;
    toHsvaString(): string;
}
