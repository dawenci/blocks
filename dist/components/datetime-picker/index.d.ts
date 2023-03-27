import type { BlocksButton } from '../button/index.js';
import type { ISelectResultComponent, ISelectableListComponent } from '../../common/connectSelectable.js';
import '../button/index.js';
import '../popup/index.js';
import { BlocksDate } from '../date/index.js';
import { BlocksInput } from '../input/index.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksTime } from '../time/index.js';
import { Control } from '../base-control/index.js';
export interface BlocksDateTimePicker extends Control {
    $popup: BlocksPopup;
    $date: BlocksDate;
    $time: BlocksTime;
    $timeValue: HTMLElement;
    $confirmButton: BlocksButton;
}
export declare class BlocksDateTimePicker extends Control implements ISelectableListComponent {
    #private;
    static get observedAttributes(): string[];
    static get disableEventTypes(): readonly string[];
    accessor format: string;
    accessor open: boolean;
    accessor placeholder: string;
    accessor $content: HTMLElement;
    accessor $result: HTMLInputElement & ISelectResultComponent;
    accessor $input: BlocksInput;
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
    get value(): null | Date;
    set value(value: null | Date);
    clearSelected(): void;
    render(): void;
}
