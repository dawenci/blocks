import type { ISelected, ISelectPair, IPairSelectResultComponent, IPairSelectResultEventMap } from '../../common/connectSelectable.js';
import { BlClearableControlBox, BlClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { BlComponentEventListener } from '../component/Component.js';
export interface BlPairResultEventMap extends BlClearableControlBoxEventMap, IPairSelectResultEventMap {
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
}
export interface BlPairResult extends BlClearableControlBox, IPairSelectResultComponent {
    addEventListener<K extends keyof BlPairResultEventMap>(type: K, listener: BlComponentEventListener<BlPairResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlPairResultEventMap>(type: K, listener: BlComponentEventListener<BlPairResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlPairResult extends BlClearableControlBox implements IPairSelectResultComponent {
    #private;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor placeholderFirst: string | null;
    accessor placeholderSecond: string | null;
    accessor autoSwitch: boolean;
    accessor autoCommit: boolean;
    accessor $content: HTMLElement;
    accessor $first: HTMLInputElement;
    accessor $second: HTMLInputElement;
    accessor $separator: HTMLElement;
    constructor();
    get active(): "second" | "first" | null;
    set active(value: "second" | "first" | null);
    get firstSelected(): ISelected<any> | null;
    set firstSelected(value: ISelected<any> | null);
    get secondSelected(): ISelected<any> | null;
    set secondSelected(value: ISelected<any> | null);
    get activeSelected(): ISelected<any> | null;
    set activeSelected(value: ISelected<any> | null);
    get formatter(): (item: ISelected<any>) => string;
    set formatter(value: (item: ISelected<any>) => string);
    get labels(): [string, string];
    get values(): [any, any];
    acceptSelected(selected: ISelectPair): void;
}
