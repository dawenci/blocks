export declare function makeAccessor<This extends Element, Value = any>(attrType: AttrType | undefined, attrName: string, options: AttrOptions): {
    get: (this: This) => Value;
    set: (this: This, value: Value) => void;
    init: (initialValue: Value) => Value;
};
