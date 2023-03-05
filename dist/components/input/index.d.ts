import '../popup/index.js';
import '../date/index.js';
import { ClearableControlBox, ClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { ComponentEventListener } from '../Component.js';
import { ISelected, ISelectResultEventMap, ISelectResultComponent } from '../../common/connectSelectable.js';
import type { EnumAttrs } from '../../decorators/attr.js';
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
    accessor value: string | null;
    accessor type: string | null;
    accessor step: string | null;
    accessor readonly: boolean;
    accessor placeholder: string | null;
    accessor name: string | null;
    accessor min: string | null;
    accessor max: string | null;
    accessor minlength: string | null;
    accessor maxlength: string | null;
    accessor autocomplete: boolean;
    accessor autofocus: boolean;
    accessor size: EnumAttrs['size'];
    constructor();
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
