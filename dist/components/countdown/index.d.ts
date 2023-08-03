import type { BlComponentEventListener, BlComponentEventMap } from '../component/Component.js';
import { BlComponent } from '../component/Component.js';
interface BlCountDownEventMap extends BlComponentEventMap {
    start: CustomEvent<void>;
    stop: CustomEvent<void>;
    finish: CustomEvent<void>;
}
export interface BlCountdown extends BlComponent {
    addEventListener<K extends keyof BlCountDownEventMap>(type: K, listener: BlComponentEventListener<BlCountDownEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlCountDownEventMap>(type: K, listener: BlComponentEventListener<BlCountDownEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlCountdown extends BlComponent {
    #private;
    accessor value: number;
    accessor format: string;
    accessor $layout: HTMLElement;
    constructor();
    render(): void;
    run(): void;
    stop(): void;
}
export {};
