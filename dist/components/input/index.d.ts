import type { EnumAttrs } from '../../decorators/attr.js';
import { ClearableControlBox, ClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { ComponentEventListener } from '../component/Component.js';
import { ISelected, ISelectResultEventMap, ISelectResultComponent } from '../../common/connectSelectable.js';
interface BlocksInputEventMap extends ClearableControlBoxEventMap, ISelectResultEventMap {
    change: CustomEvent<{
        value: string;
    }>;
}
export interface BlocksInput extends ClearableControlBox, ISelectResultComponent {
    addEventListener<K extends keyof BlocksInputEventMap>(type: K, listener: ComponentEventListener<BlocksInputEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksInputEventMap>(type: K, listener: ComponentEventListener<BlocksInputEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksInput extends ClearableControlBox implements ISelectResultComponent {
    #private;
    static get role(): string;
    static get disableEventTypes(): string[];
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
    accessor size: EnumAttrs['size'];
    accessor multiple: boolean;
    accessor $input: HTMLInputElement;
    constructor();
    acceptSelected(value: ISelected[]): void;
    clearSearch(): void;
    focus(): void;
}
export {};
