import type { NullableEnumAttr } from '../../decorators/attr.js';
import { Component } from '../component/Component.js';
declare const status: string[];
export interface BlocksProgress extends Component {
    _ref: {
        $progress: HTMLElement;
        $value: HTMLElement;
    };
}
export declare class BlocksProgress extends Component {
    accessor value: number | null;
    accessor status: NullableEnumAttr<typeof status>;
    accessor percentage: boolean;
    accessor $progress: HTMLElement;
    accessor $value: HTMLElement;
    constructor();
    render(): void;
}
export {};
