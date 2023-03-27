import type { ISelected } from '../../common/connectSelectable.js';
import '../list/index.js';
import '../input/index.js';
import './optgroup.js';
import './option.js';
import '../popup/index.js';
import '../select-result/index.js';
import { BlocksButton } from '../button/index.js';
import { BlocksList } from '../list/index.js';
import { BlocksOption } from './option.js';
import { BlocksPopup } from '../popup/index.js';
import { BlocksSelectResult } from '../select-result/index.js';
import { Control } from '../base-control/index.js';
export interface BlocksSelect extends Control {
    $popup: BlocksPopup;
    $list: BlocksList;
}
export declare class BlocksSelect extends Control {
    #private;
    static get observedAttributes(): string[];
    static get role(): string;
    static get disableEventTypes(): string[];
    accessor open: boolean;
    accessor $result: BlocksSelectResult;
    accessor $optionSlot: HTMLSlotElement;
    $list: BlocksList;
    $popup: BlocksPopup;
    $confirmButton?: BlocksButton;
    constructor();
    selected: ISelected[];
    get options(): any[];
    _openPopup(): void;
    _closePopup(): void;
    selectOption($option: BlocksOption): void;
}
