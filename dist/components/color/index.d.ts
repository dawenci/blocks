import type { ColorFormat, ColorTuple4 } from './Color.js';
import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js';
import type { EnumAttr } from '../../decorators/attr.js';
import { Color } from './Color.js';
import { Component } from '../component/Component.js';
export interface ColorEventMap extends ComponentEventMap {
    change: CustomEvent<{
        value: string;
    }>;
}
export interface BlocksColor extends Component {
    addEventListener<K extends keyof ColorEventMap>(type: K, listener: ComponentEventListener<ColorEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ColorEventMap>(type: K, listener: ComponentEventListener<ColorEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksColor extends Component {
    #private;
    accessor value: number;
    accessor mode: EnumAttr<['hex', 'rgb', 'hsl', 'hsv']>;
    accessor $layout: HTMLDivElement;
    accessor $hsv: HTMLDivElement;
    accessor $result: HTMLDivElement;
    accessor $hueBar: HTMLDivElement;
    accessor $alphaBar: HTMLDivElement;
    accessor $hsvHue: HTMLDivElement;
    accessor $hsvButton: HTMLButtonElement;
    accessor $hueButton: HTMLButtonElement;
    accessor $alphaButton: HTMLButtonElement;
    accessor $alphaBarBg: HTMLDivElement;
    accessor $resultBg: HTMLDivElement;
    accessor $modeContent: HTMLDivElement;
    accessor $modeSwitch: HTMLButtonElement;
    constructor();
    get color(): Color;
    get hex(): string;
    set hex(value: string);
    get rgb(): import("./Color.js").ColorTuple3;
    set rgb([r, g, b]: import("./Color.js").ColorTuple3);
    get rgba(): ColorTuple4;
    set rgba([r, g, b, a]: ColorTuple4);
    get hsl(): import("./Color.js").ColorTuple3;
    set hsl([hl, sl, l]: import("./Color.js").ColorTuple3);
    get hsla(): ColorTuple4;
    set hsla([hl, sl, l, a]: ColorTuple4);
    get hsv(): number[];
    set hsv([h, s, v]: number[]);
    get hsva(): number[];
    set hsva([h, s, v, a]: number[]);
    setColor(color: Color): boolean;
    format(fmt: ColorFormat): string;
}
