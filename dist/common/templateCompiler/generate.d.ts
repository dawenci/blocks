import * as BlNode from './node.js';
import { RootContext } from './Context.js';
export declare function setup(options?: any): void;
export type AttrType = 'binding' | 'event' | 'static' | 'for';
export type ParsedAttr = {
    type: AttrType;
    name: string;
    value: string;
    isProp?: boolean;
    itemEnvName?: string;
    eventFlag?: number;
};
export declare function generateCode(root: BlNode.t): {
    readonly code: string;
    readonly ctx: RootContext;
};
