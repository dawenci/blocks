import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
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
    private _hue;
    private _saturation;
    private _value;
    private _alpha;
    private _clearResizeHandler?;
    private _dragging;
    private _preventUpdateControl;
    private _preventUpdateModel;
    constructor();
    get value(): string | null;
    set value(value: string | null);
    get mode(): "rgb" | "hex" | "hsl" | "hsv";
    set mode(value: "rgb" | "hex" | "hsl" | "hsv");
    get hex(): string | null;
    set hex(value: string | null);
    get hsl(): [number, number, number];
    set hsl([hl, sl, l]: [number, number, number]);
    get hsla(): number[];
    set hsla([hl, sl, l, a]: number[]);
    get hsv(): number[];
    set hsv([h, s, v]: number[]);
    get hsva(): number[];
    set hsva([h, s, v, a]: number[]);
    get rgb(): number[];
    set rgb([r, g, b]: number[]);
    get rgba(): [number, number, number, number];
    set rgba([r, g, b, a]: [number, number, number, number]);
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
    _updateControls(): void;
    _setStates(hue: number, saturation: number, value: number, alpha: number): boolean;
    _updateState(): boolean;
    _updateBg(): void;
    _updateModels(): void;
    _initModeChangeEvent(): void;
    _initInputEvents(): void;
    _initPickEvents(): void;
    static get observedAttributes(): string[];
}
export {};
