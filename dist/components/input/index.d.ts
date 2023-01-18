import '../popup/index.js';
import '../date/index.js';
import { ClearableControlBox, ClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { ComponentEventListener } from '../Component.js';
import { ISelected, ISelectResultEventMap, ISelectResultComponent } from '../../common/connectSelectable.js';
interface BlocksInputEventMap extends ClearableControlBoxEventMap, ISelectResultEventMap {
    change: CustomEvent<{
        value: string;
    }>;
}
export interface BlocksInput extends ClearableControlBox, ISelectResultComponent {
    _ref: ClearableControlBox['_ref'] & {
        $input: HTMLInputElement;
        $prefix?: HTMLElement;
        $suffix?: HTMLElement;
        $clear?: HTMLButtonElement;
    };
    addEventListener<K extends keyof BlocksInputEventMap>(type: K, listener: ComponentEventListener<BlocksInputEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksInputEventMap>(type: K, listener: ComponentEventListener<BlocksInputEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksInput extends ClearableControlBox {
    static get role(): string;
    static get observedAttributes(): string[];
    constructor();
    get value(): string | null;
    set value(value: string | null);
    get type(): string | null;
    set type(value: string | null);
    get step(): string | null;
    set step(value: string | null);
    get size(): "small" | "large" | null;
    set size(value: "small" | "large" | null);
    get readonly(): boolean;
    set readonly(value: boolean);
    get placeholder(): string | null;
    set placeholder(value: string | null);
    get name(): string | null;
    set name(value: string | null);
    get min(): string | null;
    set min(value: string | null);
    get max(): string | null;
    set max(value: string | null);
    get minlength(): string | null;
    set minlength(value: string | null);
    get maxlength(): string | null;
    set maxlength(value: string | null);
    get autofocus(): boolean;
    set autofocus(value: boolean);
    get autocomplete(): boolean;
    set autocomplete(value: boolean);
    acceptSelected(value: ISelected[]): void;
    setValue(value: string): void;
    clearValue(): void;
    focus(): void;
    _isEmpty(): boolean;
    _renderDisabled(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
