import { BlClearableControlBox, BlClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { BlComponentEventListener } from '../component/Component.js';
import { ISelected, ISelectResultEventMap, ISelectResultComponent } from '../../common/connectSelectable.js';
export interface BlInputEventMap extends BlClearableControlBoxEventMap, ISelectResultEventMap {
    change: CustomEvent<{
        value: string;
    }>;
}
export interface BlInput extends BlClearableControlBox, ISelectResultComponent {
    addEventListener<K extends keyof BlInputEventMap>(type: K, listener: BlComponentEventListener<BlInputEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlInputEventMap>(type: K, listener: BlComponentEventListener<BlInputEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlInput extends BlClearableControlBox implements ISelectResultComponent {
    #private;
    static get role(): string;
    accessor value: string | null;
    accessor type: string | null;
    accessor step: string | null;
    accessor readonly: boolean;
    accessor placeholder: string | null;
    accessor name: string | null;
    accessor min: string | null;
    accessor max: string | null;
    accessor minlength: string | null;
    accessor maxlength: string | null;
    accessor autocomplete: boolean;
    accessor autofocus: boolean;
    accessor size: MaybeOneOf<['small', 'large']>;
    accessor multiple: boolean;
    accessor $input: HTMLInputElement;
    constructor();
    acceptSelected(value: ISelected[]): void;
    clearSearch(): void;
    focus(): void;
}
