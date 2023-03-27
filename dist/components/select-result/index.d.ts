import type { EnumAttrs } from '../../decorators/attr.js';
import type { ISelected, ISelectResultComponent, ISelectResultEventMap } from '../../common/connectSelectable.js';
import '../tag/index.js';
import { ClearableControlBox, ClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { ComponentEventListener } from '../component/Component.js';
interface BlocksSelectResultEventMap extends ClearableControlBoxEventMap, ISelectResultEventMap {
    search: CustomEvent<{
        value: string;
    }>;
    'select-result:accept': CustomEvent<{
        value: ISelected[];
    }>;
}
export interface BlocksSelectResult extends ClearableControlBox, ISelectResultComponent {
    addEventListener<K extends keyof BlocksSelectResultEventMap>(type: K, listener: ComponentEventListener<BlocksSelectResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksSelectResultEventMap>(type: K, listener: ComponentEventListener<BlocksSelectResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksSelectResult extends ClearableControlBox implements ISelectResultComponent {
    #private;
    accessor size: EnumAttrs['size'];
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
    get formatter(): (item: ISelected) => string;
    set formatter(value: (item: ISelected) => string);
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
