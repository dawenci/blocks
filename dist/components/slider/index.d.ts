import { Control } from '../base-control/index.js';
export declare class BlocksSlider extends Control {
    #private;
    static get role(): string;
    static get observedAttributes(): readonly ["disabled", "max", "min", "size", "step", "round", "value", "vertical"];
    static get disableEventTypes(): string[];
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
