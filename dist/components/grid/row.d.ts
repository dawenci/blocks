import type { NullableEnumAttr } from '../../decorators/attr.js';
import { Component } from '../component/Component.js';
export declare class BlocksRow extends Component {
    #private;
    accessor gutter: number;
    accessor wrap: boolean;
    accessor align: NullableEnumAttr<['top', 'middle', 'bottom']>;
    accessor justify: NullableEnumAttr<['start', 'end', 'center', 'space-around', 'space-between']>;
    accessor $slot: HTMLSlotElement;
    constructor();
}
