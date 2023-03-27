import type { EnumAttrs, NullableEnumAttr } from '../../decorators/attr.js';
import { Component } from '../component/Component.js';
import { SetupEmpty } from '../setup-empty/index.js';
type EmptyMap<T extends Component> = Record<'$coverSlot' | '$headerSlot' | '$bodySlot' | '$footerSlot', SetupEmpty<T>>;
export declare class BlocksCard extends Component {
    #private;
    accessor shadow: NullableEnumAttr<['hover', 'always']>;
    accessor size: EnumAttrs['size'];
    accessor $layout: HTMLElement;
    accessor $cover: HTMLElement;
    accessor $header: HTMLElement;
    accessor $body: HTMLElement;
    accessor $footer: HTMLElement;
    accessor $coverSlot: HTMLSlotElement;
    accessor $headerSlot: HTMLSlotElement;
    accessor $bodySlot: HTMLSlotElement;
    accessor $footerSlot: HTMLSlotElement;
    _emptyFeature: EmptyMap<this>;
    constructor();
}
export {};
