export declare function shadowRef(selector: string, cache?: boolean): <This extends Element, Value>(value: any, ctx: ClassAccessorDecoratorContext<This, Value>) => {
    init: (initialValue: Value) => Value;
    get: (this: This) => any;
    set: (this: This, value: Element | null) => void;
};
