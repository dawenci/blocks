import type { BlComponent } from '../component/Component.js';
export interface InitOptions<T> {
    component: T;
    predicate: (this: T) => boolean;
    container: (this: T) => Element;
    loop?: boolean;
    init?: (this: T) => void;
}
export declare class SetupFocusCapture<T extends BlComponent = BlComponent> {
    #private;
    static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>): SetupFocusCapture<T>;
    constructor(options: InitOptions<T>);
    get $lastFocus(): HTMLElement | null;
    set $lastFocus(value: HTMLElement | null);
    get $firstFocusable(): HTMLButtonElement | null;
    get $lastFocusable(): HTMLButtonElement | null;
    withContainer(container: InitOptions<T>['container']): this;
    withPredicate(getDisabled: InitOptions<T>['predicate']): this;
    withLoop(loop: boolean): void;
    start(): this;
    stop(): this;
    setup(): this;
}
