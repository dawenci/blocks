import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
import { ColorFormat, ColorTuple4 } from './Color.js';
import type { EnumAttr } from '../../decorators/attr.js';
interface ColorEventMap extends ComponentEventMap {
    change: CustomEvent<{
        value: string;
    }>;
}
export interface BlocksColor extends Component {
    _ref: {
        $layout: HTMLDivElement;
        $hsv: HTMLDivElement;
        $result: HTMLDivElement;
        $hueBar: HTMLDivElement;
        $alphaBar: HTMLDivElement;
        $hsvHue: HTMLDivElement;
        $hsvButton: HTMLButtonElement;
        $hueButton: HTMLButtonElement;
        $alphaButton: HTMLButtonElement;
        $alphaBarBg: HTMLDivElement;
        $resultBg: HTMLDivElement;
        $modeContent: HTMLDivElement;
        $modeSwitch: HTMLButtonElement;
    };
    addEventListener<K extends keyof ColorEventMap>(type: K, listener: ComponentEventListener<ColorEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ColorEventMap>(type: K, listener: ComponentEventListener<ColorEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksColor extends Component {
    static get observedAttributes(): string[];
    accessor value: number | null;
    accessor mode: EnumAttr<['hex', 'rgb', 'hsl', 'hsv']>;
    private _lastHue;
    private _color;
    get _alpha(): number;
    private _clearResizeHandler?;
    private _dragging;
    private _preventUpdateControl;
    private _preventUpdateModel;
    constructor();
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
    get hsv(): import("./Color.js").ColorTuple3;
    set hsv([h, s, v]: import("./Color.js").ColorTuple3);
    get hsva(): ColorTuple4;
    set hsva([h, s, v, a]: ColorTuple4);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    format(fmt: ColorFormat): string;
    _updateControls(): void;
    _setStates(hue: number, saturation: number, value: number, alpha: number): boolean;
    _updateState(): boolean;
    _updateBg(): void;
    _updateModels(): void;
    _initModeChangeEvent(): void;
    _initInputEvents(): void;
    _initPickEvents(): void;
}
export {};
