import type { Component } from '../component/Component';
export interface InitOptions<T> {
    component: T;
    predicate: (this: T) => boolean;
    target: (this: T) => ArrayLike<Element>;
    postUpdate?: (this: T) => void;
}
export declare class SetupDisabled<T extends Component = Component> {
    #private;
    static setup<T extends Component = Component>(options: InitOptions<T>): SetupDisabled<T>;
    constructor(options: InitOptions<T>);
    withTarget(target: InitOptions<T>['target']): this;
    withPredicate(getDisabled: InitOptions<T>['predicate']): this;
    withPostUpdate(postUpdate: InitOptions<T>['postUpdate']): this;
    setup(): this;
    update(): void;
}
