import type { BlControlEventMap } from '../base-control/index.js';
import type { BlComponentEventListener } from '../component/Component.js';
import { BlControl } from '../base-control/index.js';
declare enum State {
    Init = "Init",
    OperandLeft = "OperandLeft",
    OperandLeftEnd = "OperandLeftEnd",
    Operator = "Operator",
    OperandRight = "OperandRight",
    OperandRightEnd = "OperandRightEnd",
    Result = "Result"
}
export interface CalcEventMap extends BlControlEventMap {
    'bl:calc:screen': CustomEvent<{
        value: number;
    }>;
    'bl:calc:result': CustomEvent<{
        value: number;
    }>;
}
export interface BlCalc extends BlControl {
    addEventListener<K extends keyof CalcEventMap>(type: K, listener: BlComponentEventListener<CalcEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof CalcEventMap>(type: K, listener: BlComponentEventListener<CalcEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlCalc extends BlControl {
    accessor screen: string;
    accessor $layout: HTMLDivElement;
    accessor $result: HTMLDivElement;
    accessor $input: HTMLDivElement;
    memory: number;
    operand: number | null;
    operator: string | null;
    state: State;
    calcFn: ((n: number) => number) | null;
    inputStyle: {};
    makeAdd: (n1: number) => (n2: number) => number;
    makeSub: (n1: number) => (n2: number) => number;
    makeMul: (n1: number) => (n2: number) => number;
    makeDiv: (n1: number) => (n2: number) => number;
    makeFn: (op: string) => (n1: number) => (n2: number) => number;
    constructor();
    get memoryKeys(): {
        value: string;
        label: string;
    }[];
    get actionKeys(): {
        value: string;
        label: string;
    }[];
    get numberKeys(): {
        value: string;
        label: string;
    }[];
    get operatorKeys(): {
        value: string;
        label: string;
    }[];
    get keymap(): Map<string, string>;
    render(): void;
    onScreenChange(): void;
    onKeyPress(event: KeyboardEvent): void;
    getScreenValue(): number;
    setScreenValue(n: number | string): void;
    memoryRecall(): void;
    memoryClear(): void;
    memoryAdd(): void;
    memorySub(): void;
    deleteChar(): void;
    clearEntry(): void;
    clearAll(): void;
    input(key: string): void;
    inputNumber(n: string): void;
    inputOperator(op: string): void;
    inputEqual(): void;
}
export {};
