import type { EnumAttrs } from '../../decorators/attr.js';
import { Component } from '../component/Component.js';
declare const types: readonly ["primary", "danger", "warning", "success"];
export declare class BlocksTag extends Component {
    accessor round: boolean;
    accessor type: (typeof types)[number];
    accessor closeable: boolean;
    accessor outline: boolean;
    accessor size: EnumAttrs['size'];
    accessor $layout: HTMLElement;
    constructor();
    render(): void;
}
export {};
