import { Component } from '../Component.js';
export declare class BlocksBackTop extends Component {
    #private;
    _model: {
        data: {
            scrolled: number;
            duration: number;
            threshold: number;
            visible: boolean;
        };
        _isDestroyed: boolean;
        get<K extends "threshold" | "visible" | "scrolled" | "duration">(key: K): {
            scrolled: number;
            duration: number;
            threshold: number;
            visible: boolean;
        }[K];
        set<K_1 extends "threshold" | "visible" | "scrolled" | "duration">(key: K_1, value: {
            scrolled: number;
            duration: number;
            threshold: number;
            visible: boolean;
        }[K_1], preventEmit?: boolean): void;
        destroy(): void;
        __events__?: any;
        __listenId__?: string | undefined;
        __listeners__?: any;
        __listeningTo__?: any;
        on(name: string, callback?: any, context?: any): any;
        on(name: Record<string, any>, context?: any): any;
        off(name?: any, callback?: any, context?: any): any;
        trigger(name: any, ...rest: any[]): any;
        listenTo(target: any, name: any, callback?: any): any;
        stopListening(obj?: any, name?: any, callback?: any): any;
        once(name: any, callback: any, context?: any): any;
        listenToOnce(obj: any, name: any, callback: any): any;
    };
    accessor duration: number;
    accessor threshold: number;
    constructor();
    get target(): string | Node | null;
    set target(value: string | null | Node | (() => Node));
    get targetElement(): Element | Window;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    disconnectedCallback(): void;
}
