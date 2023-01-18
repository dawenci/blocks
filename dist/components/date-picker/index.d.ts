import '../popup/index.js';
import '../button/index.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksInput } from '../input/index.js';
import { BlocksDate } from '../date/index.js';
import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js';
interface DatePickerEventMap extends ComponentEventMap {
    opened: CustomEvent;
    closed: CustomEvent;
    change: CustomEvent<{
        value: any;
    }>;
}
export interface BlocksDatePicker extends Component {
    _ref: {
        $popup: BlocksPopup;
        $date: BlocksDate;
        $input: BlocksInput;
    };
    addEventListener<K extends keyof DatePickerEventMap>(type: K, listener: ComponentEventListener<DatePickerEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof DatePickerEventMap>(type: K, listener: ComponentEventListener<DatePickerEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksDatePicker extends Component {
    #private;
    constructor();
    _confirm(): void;
    render(): void;
    get value(): Date | Date[] | null;
    set value(value: Date | Date[] | null);
    get disabledDate(): ((data: import("../date/helpers.js").DateModel, context: {
        depth: import("../date/helpers.js").Depth;
        viewDepth: import("../date/helpers.js").Depth;
        component: BlocksDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: import("../date/helpers.js").DateModel, context: {
        depth: import("../date/helpers.js").Depth;
        viewDepth: import("../date/helpers.js").Depth;
        component: BlocksDate;
    }) => boolean) | undefined);
    getDateProp(prop: string): any;
    setDateProp(prop: string, value: any): void;
    getInputProp(prop: string): any;
    setInputProp(prop: string, value: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    static get observedAttributes(): string[];
}
export {};
