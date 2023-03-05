import './optgroup.js';
import './option.js';
import '../popup/index.js';
import '../input/index.js';
import '../select-result/index.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksSelectResult } from '../select-result/index.js';
import { BlocksOption } from './option.js';
import { ISelected } from '../../common/connectSelectable.js';
export interface BlocksSelect extends BlocksSelectResult {
    _ref: BlocksSelectResult['_ref'] & {
        $optionSlot: HTMLSlotElement;
        $popup: BlocksPopup;
        $list: HTMLElement;
    };
}
export declare class BlocksSelect extends BlocksSelectResult {
    #private;
    static get observedAttributes(): string[];
    static get role(): string;
    constructor();
    searchString: string;
    get selectedOptions(): ISelected | ISelected[] | null | undefined;
    set selectedOptions(value: ISelected | ISelected[] | null | undefined);
    get optionFilter(): (option: any, searchString: string) => any;
    set optionFilter(value: (option: any, searchString: string) => any);
    get options(): any[];
    select(selected: ISelected): void;
    _openPopup(): void;
    _closePopup(): void;
    clearValue(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    _selectOption(option: BlocksOption): void;
    filter(): void;
}
