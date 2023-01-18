import { BlocksInput } from '../input/index.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksDate } from '../date/index.js';
import { BlocksTime } from '../time/index.js';
import { BlocksButton } from '../button/index.js';
import { ClearableControlBox } from '../base-clearable-control-box/index.js';
export interface BlocksDateTimePicker extends ClearableControlBox {
    _ref: ClearableControlBox['_ref'] & {
        $content: HTMLElement;
        $fromDate: BlocksInput;
        $toDate: BlocksInput;
        $popup: BlocksPopup;
        $date: BlocksDate;
        $time: BlocksTime;
        $timeValue: HTMLElement;
        $confirm: BlocksButton;
    };
}
export declare class BlocksDateTimePicker extends ClearableControlBox {
    #private;
    constructor();
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
    get disabledHour(): ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined;
    set disabledHour(value: ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined);
    get disabledMinute(): ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined;
    set disabledMinute(value: ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined);
    get disabledSecond(): ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined;
    set disabledSecond(value: ((data: number, context: {
        hour: number | null;
        minute: number | null;
        second: number | null;
        component: BlocksTime;
    }) => boolean) | undefined);
    get range(): boolean;
    set range(value: boolean);
    get placeholderFrom(): string | null;
    set placeholderFrom(value: string | null);
    get placeholderTo(): string | null;
    set placeholderTo(value: string | null);
    get activeValue(): Date | null;
    set activeValue(value: Date | null);
    get value(): null | Date | [Date, Date];
    set value(value: null | Date | [Date, Date]);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    static get observedAttributes(): string[];
}
