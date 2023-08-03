import { BlComponent } from '../component/Component.js';
import { SetupEmpty } from '../setup-empty/index.js';
type EmptyMap<T extends BlComponent> = Record<'$coverSlot' | '$headerSlot' | '$bodySlot' | '$footerSlot', SetupEmpty<T>>;
export declare class BlCard extends BlComponent {
    #private;
    accessor shadow: MaybeOneOf<['hover', 'always']>;
    accessor size: MaybeOneOf<['small', 'large']>;
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
