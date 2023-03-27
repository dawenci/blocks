import type { BlocksButton } from '../button/index.js';
import type { BlocksPopup } from '../popup/index.js';
import type { ISelectResultComponent } from '../../common/connectSelectable.js';
import '../button/index.js';
import '../popup/index.js';
import { BlocksDate } from '../date/index.js';
import { BlocksTime } from '../time/index.js';
import { ClearableControlBox } from '../base-clearable-control-box/index.js';
export interface BlocksDateTimeRangePicker extends ClearableControlBox {
    $popup: BlocksPopup;
    $date: BlocksDate;
    $time: BlocksTime;
    $timeValue: HTMLElement;
    $confirm: BlocksButton;
}
export declare class BlocksDateTimeRangePicker extends ClearableControlBox {
    #private;
    accessor placeholderFrom: string;
    accessor placeholderTo: string;
    accessor $content: HTMLElement;
    accessor $fromDate: HTMLInputElement & ISelectResultComponent;
    accessor $toDate: HTMLInputElement & ISelectResultComponent;
    accessor format: string;
    constructor();
    get disabledDate(): ((data: import("../date/type").ItemModel, context: {
        depth: import("../date/type").Depth;
        viewDepth: import("../date/type").Depth;
        component: BlocksDate;
    }) => boolean) | undefined;
    set disabledDate(value: ((data: import("../date/type").ItemModel, context: {
        depth: import("../date/type").Depth;
        viewDepth: import("../date/type").Depth;
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
    render(): void;
    static get observedAttributes(): string[];
}
