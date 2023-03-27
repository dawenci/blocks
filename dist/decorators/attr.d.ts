import type { AttrType, AttrOptions } from './decorators.js';
export declare function attr(attrType?: AttrType, options?: AttrOptions): <This extends Element, Value>(accessor: {
    get: () => Value;
    set: (value: Value) => void;
}, ctx: ClassAccessorDecoratorContext<This, Value>) => {
    get: (this: This) => Value;
    set: (this: This, value: Value) => void;
    init: (initialValue: Value) => Value;
};
export type EnumAttr<A extends readonly any[]> = A[number];
export type NullableEnumAttr<A extends readonly any[]> = EnumAttr<A> | null;
export type EnumAttrs = {
    size: EnumAttr<['small', 'large']>;
};
export declare const attrs: {
    size: <This extends Element, Value>(accessor: {
        get: () => Value;
        set: (value: Value) => void;
    }, ctx: ClassAccessorDecoratorContext<This, Value>) => {
        get: (this: This) => Value;
        set: (this: This, value: Value) => void;
        init: (initialValue: Value) => Value;
    };
};
