import type { EnumAttrs } from '../../decorators/attr.js';
import type { ISelected, IPairSelectResultComponent, IPairSelectResultEventMap } from '../../common/connectSelectable.js';
import { ClearableControlBox, ClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { ComponentEventListener } from '../component/Component.js';
export interface BlocksPairResultEventMap extends ClearableControlBoxEventMap, IPairSelectResultEventMap {
    active: CustomEvent<{
        value: 'first' | 'second' | null;
    }>;
    'change-first': CustomEvent<{
        value: ISelected | null;
    }>;
    'change-second': CustomEvent<{
        value: ISelected | null;
    }>;
    change: CustomEvent<{
        value: [ISelected | null, ISelected | null];
    }>;
    search: CustomEvent<{
        value: string;
    }>;
    'select-result:accept': CustomEvent;
}
export interface BlocksPairResult extends ClearableControlBox, IPairSelectResultComponent {
    addEventListener<K extends keyof BlocksPairResultEventMap>(type: K, listener: ComponentEventListener<BlocksPairResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksPairResultEventMap>(type: K, listener: ComponentEventListener<BlocksPairResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksPairResult extends ClearableControlBox implements IPairSelectResultComponent {
    #private;
    static get disableEventTypes(): readonly string[];
    accessor size: EnumAttrs['size'];
    accessor placeholderFirst: string | null;
    accessor placeholderSecond: string | null;
    accessor $content: HTMLElement;
    accessor $first: HTMLInputElement;
    accessor $second: HTMLInputElement;
    constructor();
    get active(): "second" | "first" | null;
    set active(value: "second" | "first" | null);
    get firstSelected(): ISelected | null;
    set firstSelected(value: ISelected | null);
    get secondSelected(): ISelected | null;
    set secondSelected(value: ISelected | null);
    get activeSelected(): ISelected | null;
    set activeSelected(value: ISelected | null);
    get formatter(): (item: ISelected) => string;
    set formatter(value: (item: ISelected) => string);
    get labels(): [string, string];
    get values(): [any, any];
    acceptSelected(selected: [ISelected | null, ISelected | null]): void;
}
