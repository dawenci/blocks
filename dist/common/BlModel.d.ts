import { BlEvent } from './BlEvent.js';
export interface BlModel<T extends object = object> extends BlEvent {
    data: T;
}
export declare class BlModel<T> extends BlEvent {
    data: T;
    _isDestroyed: boolean;
    silent: boolean;
    constructor(data: T);
    has(key: any): boolean;
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K]): boolean;
    batch(fn: (trigger: (name: string, payload: any) => void) => void): void;
    reset(data: T): void;
    trigger(name: string | string[], ...args: any[]): this;
    destroy(): void;
}
