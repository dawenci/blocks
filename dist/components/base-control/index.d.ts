import { Component } from '../component/Component.js';
import { SetupDisabled } from '../setup-disabled/index.js';
import { SetupTabIndex } from '../setup-tab-index/index.js';
export declare class Control extends Component {
    static get observedAttributes(): readonly string[];
    static get disableEventTypes(): readonly string[];
    accessor disabled: boolean;
    constructor();
    _disabledFeature: SetupDisabled<this>;
    _tabIndexFeature: SetupTabIndex<this>;
}
