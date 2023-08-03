import type { BlScrollable } from '../scrollable/index.js';
import type { BlComponentEventListener } from '../component/Component.js';
import type { ISelectListEventMap, ISelectableListComponent, ISelected } from '../../common/connectSelectable.js';
import '../scrollable/index.js';
import { IReactive } from '../../common/reactive.js';
import { BlComponent } from '../component/Component.js';
export interface BlTimeEventMap extends ISelectListEventMap {
    change: CustomEvent<{
        value: TimeModel | null;
    }>;
}
export interface BlTime extends BlComponent, ISelectableListComponent {
    addEventListener<K extends keyof BlTimeEventMap>(type: K, listener: BlComponentEventListener<BlTimeEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlTimeEventMap>(type: K, listener: BlComponentEventListener<BlTimeEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export type TimeModel = {
    hour: number;
    minute: number;
    second: number;
};
export type ValueField = 'hour' | 'minute' | 'second';
export declare const valueFields: readonly ["hour", "minute", "second"];
export declare const timeEquals: (a: TimeModel | null, b: TimeModel | null) => boolean;
export declare class BlTime extends BlComponent implements ISelectableListComponent {
    #private;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor hour: number | null;
    accessor minute: number | null;
    accessor second: number | null;
    accessor $layout: HTMLElement;
    accessor $hours: BlScrollable;
    accessor $minutes: BlScrollable;
    accessor $seconds: BlScrollable;
    formatter: (model: TimeModel | null) => string;
    constructor();
    get value(): TimeModel | null;
    set value(value: TimeModel | null);
    get disabledTime(): ((hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]) | undefined;
    set disabledTime(value: ((hour: number | null, minute: number | null, second: number | null) => [boolean, boolean, boolean]) | undefined);
    isDisabled(field: ValueField, value: number): boolean;
    _getList(field: ValueField): BlScrollable;
    firstEnableModel(fixHour?: number, fixMinute?: number, fixSecond?: number): TimeModel | null;
    setModel(model: IReactive<TimeModel | null>, value: TimeModel | null): void;
    setField(modelRef: IReactive<TimeModel | null>, field: ValueField, value: number | null): void;
    _doPassiveScroll(): void;
    scrollToActive(): void;
    triggerChange(): void;
    clearSelected(): void;
    deselect(selected: ISelected<TimeModel>): void;
}
