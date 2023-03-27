import type { ColorFormat } from '../color/Color.js';
import '../color/index.js';
import '../icon/index.js';
import '../input/index.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksColor } from '../color/index.js';
import { Control } from '../base-control/index.js';
export interface BlocksColorPicker extends Control {
    $popup: BlocksPopup;
    $color: BlocksColor;
}
export declare class BlocksColorPicker extends Control {
    #private;
    static get observedAttributes(): readonly string[];
    static get disableEventTypes(): readonly string[];
    accessor value: number;
    accessor open: boolean;
    accessor $layout: HTMLElement;
    accessor $icon: HTMLElement;
    constructor();
    get hex(): string;
    set hex(value: string);
    get hsl(): import("../color/Color.js").ColorTuple3;
    set hsl(value: import("../color/Color.js").ColorTuple3);
    get hsla(): import("../color/Color.js").ColorTuple4;
    set hsla(value: import("../color/Color.js").ColorTuple4);
    get hsv(): number[];
    set hsv(value: number[]);
    get hsva(): number[];
    set hsva(value: number[]);
    get rgb(): import("../color/Color.js").ColorTuple3;
    set rgb(value: import("../color/Color.js").ColorTuple3);
    get rgba(): import("../color/Color.js").ColorTuple4;
    set rgba(value: import("../color/Color.js").ColorTuple4);
    render(): void;
    format(fmt: ColorFormat): string;
}
