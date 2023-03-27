import type { Component } from '../component/Component';
export interface InitOptions<T> {
    component: T;
    update: (this: T, e: MouseEvent) => any;
    target: (this: T) => Element[];
}
export declare class SetupClickOutside<T extends Component = Component> {
    #private;
    static setup<T extends Component = Component>(options: InitOptions<T>): SetupClickOutside<T>;
    constructor(options: InitOptions<T>);
    withTarget(target: InitOptions<T>['target']): this;
    withUpdate(update: InitOptions<T>['update']): this;
    setup(): this;
    bind(): this;
    unbind(): this;
}
