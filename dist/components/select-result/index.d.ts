import type { ISelected, ISelectResultComponent, ISelectResultEventMap } from '../../common/connectSelectable.js';
import '../tag/index.js';
import { BlClearableControlBox, BlClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { BlComponentEventListener } from '../component/Component.js';
interface BlSelectResultEventMap extends BlClearableControlBoxEventMap, ISelectResultEventMap {
    search: CustomEvent<{
        value: string;
    }>;
}
export interface BlSelectResult extends BlClearableControlBox, ISelectResultComponent {
    addEventListener<K extends keyof BlSelectResultEventMap>(type: K, listener: BlComponentEventListener<BlSelectResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlSelectResultEventMap>(type: K, listener: BlComponentEventListener<BlSelectResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlSelectResult extends BlClearableControlBox implements ISelectResultComponent {
    #private;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor multiple: boolean;
    accessor searchable: boolean;
    accessor maxTagCount: number;
    accessor placeholder: string | null;
    accessor $content: HTMLElement;
    accessor $search: HTMLInputElement | null;
    accessor $valueText: HTMLElement | null;
    accessor $placeholder: HTMLElement | null;
    constructor();
    get data(): ISelected[];
    set data(selected: ISelected[]);
    get dataCount(): number;
    get formatter(): (item: ISelected<any>) => string;
    set formatter(value: (item: ISelected<any>) => string);
    get label(): string;
    get labels(): string[];
    get value(): any | null;
    get values(): any[];
    acceptSelected(selected: ISelected[]): void;
    _renderSearchable(): void;
    clearSearch(): void;
    _reanderData(): void;
}
export {};
