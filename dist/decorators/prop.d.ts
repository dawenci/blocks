import type { PropOptions } from './decorators.js';
export declare function prop(options?: PropOptions): <This extends Element, Value>(accessor: {
    get: () => Value;
    set: (value: Value) => void;
}, ctx: ClassAccessorDecoratorContext<This, Value>) => {
    get: (this: This) => Value;
    set: (this: This, value: Value) => void;
    init: (initialValue: Value) => Value;
};
