import { BlControl } from '../base-control/index.js';
export declare class BlSlider extends BlControl {
    #private;
    static get role(): string;
    static get observedAttributes(): readonly ["disabled", "max", "min", "size", "step", "round", "value", "vertical"];
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
    constructor();
    get value(): number;
    set value(value: number);
    render(): void;
}
