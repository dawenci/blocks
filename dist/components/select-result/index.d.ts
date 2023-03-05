import '../tag/index.js';
import { ComponentEventListener } from '../Component.js';
import { ClearableControlBox, ClearableControlBoxEventMap } from '../base-clearable-control-box/index.js';
import { ISelected, ISelectResultComponent, ISelectResultEventMap } from '../../common/connectSelectable.js';
import { EnumAttrs } from '../../decorators/attr.js';
interface BlocksSelectResultEventMap extends ClearableControlBoxEventMap, ISelectResultEventMap {
    search: CustomEvent<{
        value: string;
    }>;
}
export interface BlocksSelectResult extends ClearableControlBox, ISelectResultComponent {
    _ref: ClearableControlBox['_ref'] & {
        $content: HTMLElement;
        $search?: HTMLInputElement;
        $plainTextValue?: HTMLElement;
        $placeholder?: HTMLElement;
    };
    addEventListener<K extends keyof BlocksSelectResultEventMap>(type: K, listener: ComponentEventListener<BlocksSelectResultEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlocksSelectResultEventMap>(type: K, listener: ComponentEventListener<BlocksSelectResultEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlocksSelectResult extends ClearableControlBox {
    #private;
    static get observedAttributes(): string[];
    accessor size: EnumAttrs['size'];
    accessor multiple: boolean;
    accessor searchable: boolean;
    accessor maxTagCount: number;
    accessor placeholder: string | null;
    constructor();
    get formatter(): (item: ISelected) => string;
    set formatter(value: (item: ISelected) => string);
    get label(): string | null;
    _value?: ISelected | ISelected[] | null;
    get value(): ISelected | ISelected[] | null | undefined;
    set value(value: ISelected | ISelected[] | null | undefined);
    acceptSelected(value: ISelected[]): void;
    select(selected: ISelected): void;
    deselect(selected: ISelected): void;
    getValue(): ISelected | null;
    getValues(): ISelected[];
    clearValue(): void;
    _isEmpty(): boolean;
    clearSearch(): void;
    _renderClass(): void;
    _renderPlaceholder(): void;
    _renderSearchable(): void;
    _renderValue(): void;
    render(): void;
    connectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
}
export {};
