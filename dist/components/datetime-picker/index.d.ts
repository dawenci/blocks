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
    accessor range: boolean;
    accessor placeholderFrom: string;
    accessor placeholderTo: string;
    constructor();
    get disabledDate(): ((data: import("../date/helpers").DateModel, context: {
        depth: import("../date/helpers").Depth;
        viewDepth: import("../date/helpers").Depth;
        component: BlocksDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: import("../date/helpers").DateModel, context: {
        depth: import("../date/helpers").Depth;
        viewDepth: import("../date/helpers").Depth;
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
