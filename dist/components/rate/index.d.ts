import { Control } from '../base-control/index.js';
export declare class BlocksRate extends Control {
    #private;
    static get disableEventTypes(): readonly string[];
    accessor value: number;
    accessor half: boolean;
    accessor resultMode: boolean;
    accessor $layout: HTMLElement;
    constructor();
    get hoverValue(): number | undefined;
    set hoverValue(value: number | undefined);
    render(): void;
}
