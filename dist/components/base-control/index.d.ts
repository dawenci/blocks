import type { BlComponentEventMap } from '../component/Component.js';
import { BlComponent } from '../component/Component.js';
import { SetupDisabled } from '../setup-disabled/index.js';
import { SetupTabIndex } from '../setup-tab-index/index.js';
export type BlControlEventMap = BlComponentEventMap;
export declare class BlControl extends BlComponent {
    static get observedAttributes(): readonly string[];
    accessor disabled: boolean;
    constructor();
    _disabledFeature: SetupDisabled<this>;
    _tabIndexFeature: SetupTabIndex<this>;
}
