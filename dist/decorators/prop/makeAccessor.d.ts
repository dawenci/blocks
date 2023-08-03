export declare function makeAccessor<This extends Element, Value = any>(propName: string, options: PropOptions): {
    get: (this: This) => Value;
    set: (this: This, value: Value) => void;
    init: (initialValue: Value) => Value;
};
