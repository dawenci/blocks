import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js';
import { Component } from '../component/Component.js';
export declare class BlocksSteps extends Component {
    #private;
    accessor direction: NullableEnumAttr<['horizontal', 'vertical']>;
    accessor size: EnumAttrs['size'];
    accessor $layout: HTMLElement;
    accessor $slot: HTMLSlotElement;
    constructor();
    stepIndex($step: HTMLElement): number;
}
