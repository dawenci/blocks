import type { BlComponentEventListener } from '../component/Component.js';
import type { BlControlEventMap } from '../base-control/index.js';
import { BlControl } from '../base-control/index.js';
export interface BlRateEventMap extends BlControlEventMap {
    change: CustomEvent<{
        value: number;
    }>;
}
export interface BlRate extends BlControl {
    addEventListener<K extends keyof BlRateEventMap>(type: K, listener: BlComponentEventListener<BlRateEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlRateEventMap>(type: K, listener: BlComponentEventListener<BlRateEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlRate extends BlControl {
    #private;
    accessor value: number;
    accessor half: boolean;
    accessor resultMode: boolean;
    accessor $layout: HTMLElement;
    constructor();
    get hoverValue(): number | undefined;
    set hoverValue(value: number | undefined);
    render(): void;
}
