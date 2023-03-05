import { BlocksPopup } from '../popup/index.js';
import { BlocksColor } from '../color/index.js';
import { ColorFormat } from '../color/Color.js';
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
    accessor disabled: boolean;
    constructor();
    get hex(): string;
    set hex(value: string);
    get hsl(): import("../color/Color.js").ColorTuple3;
    set hsl(value: import("../color/Color.js").ColorTuple3);
    get hsla(): import("../color/Color.js").ColorTuple4;
    set hsla(value: import("../color/Color.js").ColorTuple4);
    get hsv(): import("../color/Color.js").ColorTuple3;
    set hsv(value: import("../color/Color.js").ColorTuple3);
    get hsva(): import("../color/Color.js").ColorTuple4;
    set hsva(value: import("../color/Color.js").ColorTuple4);
    get rgb(): import("../color/Color.js").ColorTuple3;
    set rgb(value: import("../color/Color.js").ColorTuple3);
    get rgba(): import("../color/Color.js").ColorTuple4;
    set rgba(value: import("../color/Color.js").ColorTuple4);
    get value(): number | null;
    set value(value: number | null);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    format(fmt: ColorFormat): string;
}
