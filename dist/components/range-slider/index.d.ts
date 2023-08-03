import { BlControl } from '../base-control/index.js';
export interface BlRangeSlider extends BlControl {
    ref: {
        $layout: HTMLElement;
        $track: HTMLElement;
        $trackBg: HTMLElement;
        $point: HTMLButtonElement;
        $point2: HTMLButtonElement;
        $range: HTMLElement;
    };
}
export declare class BlRangeSlider extends BlControl {
    #private;
    static get role(): string;
    static get observedAttributes(): string[];
    accessor shadowSize: number;
    accessor size: number;
    accessor min: number;
    accessor max: number;
    accessor step: number;
    accessor vertical: boolean;
    accessor round: number;
    accessor $layout: HTMLElement;
    accessor $track: HTMLElement;
    accessor $trackBg: HTMLElement;
    accessor $point: HTMLButtonElement;
    accessor $point2: HTMLButtonElement;
    accessor $range: HTMLElement;
    constructor();
    get value(): [number, number];
    set value(value: [number, number]);
    render(): void;
}
