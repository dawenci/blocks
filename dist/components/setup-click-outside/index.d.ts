import type { BlComponent } from '../component/Component';
export interface InitOptions<T> {
    component: T;
    update: (this: T, e: MouseEvent) => any;
    target: (this: T) => Element[];
    init?: (this: T) => void;
}
export declare class SetupClickOutside<T extends BlComponent = BlComponent> {
    #private;
    static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>): SetupClickOutside<T>;
    constructor(options: InitOptions<T>);
    withTarget(target: InitOptions<T>['target']): this;
    withUpdate(update: InitOptions<T>['update']): this;
    setup(): this;
    bind(): this;
    unbind(): this;
}
