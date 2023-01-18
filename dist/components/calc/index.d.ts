import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
declare enum State {
    Init = "Init",
    OperandLeft = "OperandLeft",
    OperandLeftEnd = "OperandLeftEnd",
    Operator = "Operator",
    OperandRight = "OperandRight",
    OperandRightEnd = "OperandRightEnd",
    Result = "Result"
}
interface CalcEventMap extends ComponentEventMap {
    screen: CustomEvent<{
        value: number;
    }>;
    result: CustomEvent<{
        value: number;
    }>;
}
export interface BlocksCalc extends Component {
    _ref: {
        $layout: HTMLDivElement;
        $result: HTMLDivElement;
        $input: HTMLDivElement;
    };
    addEventListener<K extends keyof CalcEventMap>(type: K, listener: ComponentEventListener<CalcEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof CalcEventMap>(type: K, listener: ComponentEventListener<CalcEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksCalc extends Component {
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
    get dark(): boolean;
    set dark(value: boolean);
    get screen(): string;
    set screen(value: string);
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
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
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
    static get observedAttributes(): string[];
}
export {};
