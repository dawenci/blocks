import type { ISelected } from '../../common/connectSelectable.js';
import '../button/index.js';
import '../list/index.js';
import '../popup/index.js';
import './optgroup.js';
import './option.js';
import '../select-result/index.js';
import { PROXY_POPUP_ACCESSORS, PROXY_RESULT_ACCESSORS } from '../../common/constants.js';
import { BlButton } from '../button/index.js';
import { BlList } from '../list/index.js';
import { BlOption } from './option.js';
import { BlPopup } from '../popup/index.js';
import { BlSelectResult } from '../select-result/index.js';
import { BlControl } from '../base-control/index.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
export interface BlSelect extends BlControl, Pick<BlPopup, OneOf<typeof PROXY_POPUP_ACCESSORS>>, Pick<BlSelectResult, OneOf<typeof PROXY_RESULT_ACCESSORS>> {
    $popup: BlPopup;
    $list: BlList;
}
export declare class BlSelect extends BlControl {
    #private;
    static get observedAttributes(): string[];
    static get role(): string;
    accessor $result: BlSelectResult;
    accessor $optionSlot: HTMLSlotElement;
    $list: BlList;
    $popup: BlPopup;
    $confirmButton?: BlButton;
    _model: import("../../common/reactive.js").IReactive<string[]>;
    constructor();
    selected: ISelected[];
    get options(): any[];
    _clickOutside: SetupClickOutside<this>;
    selectOption($option: BlOption): void;
}
