import type { BlComponent } from '../component/Component';
export interface InitOptions<T> {
    component: T;
    predicate: (this: T) => boolean;
    target: (this: T) => Element;
    className?: string;
    postUpdate?: (this: T) => void;
    init?: (this: T) => void;
}
export declare class SetupEmpty<T extends BlComponent = BlComponent> {
    #private;
    static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>): SetupEmpty<T>;
    constructor(options: InitOptions<T>);
    withTarget(target: InitOptions<T>['target']): this;
    withPredicate(isEmpty: InitOptions<T>['predicate']): this;
    withPostUpdate(postUpdate: InitOptions<T>['postUpdate']): this;
    setup(): this;
    update(): this;
}
