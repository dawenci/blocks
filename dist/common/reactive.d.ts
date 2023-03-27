export interface IReactive<T = any> {
    content: T;
    hasSub(sub: Sub<T>): boolean;
    addSub(sub: Sub<T>): void;
    removeSub(sub: Sub<T>): void;
    clearSub(): void;
}
interface SubFn<T = any> {
    (value: T, oldValue: T): void;
}
interface SubObj<T = any> {
    update(value: T, oldValue: T): void;
}
export type Sub<T> = SubFn<T> | SubObj<T>;
type ExtractReactive<T> = T extends IReactive<infer IReactiveType> ? IReactiveType : never;
type ExtractReactiveTuple<Tuple extends [...any[]]> = {
    [Index in keyof Tuple]: ExtractReactive<Tuple[Index]>;
};
export declare const reactive: <T>(val: T, equal?: ((a: T, b: T) => boolean) | undefined) => IReactive<T>;
export declare const computed: <T, Deps extends IReactive<any>[]>(update: (...args: ExtractReactiveTuple<Deps>) => T, deps: Deps, equal?: (a: T, b: T) => boolean) => IReactive<T>;
export declare const subscribe: <T>(reactive: IReactive<T>, sub: Sub<T>) => () => void;
export declare const unsubscribe: <T>(reactive: IReactive<T>, sub?: Sub<T> | undefined) => void;
export {};
