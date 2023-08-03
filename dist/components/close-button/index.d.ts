import { BlControl } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
export declare class BlCloseButton extends BlControl {
    static get role(): string;
    accessor $layout: HTMLElement;
    constructor();
    _controlFeature: SetupControlEvent<this>;
}
