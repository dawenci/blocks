import type { BlComponent } from '../component/Component';
export interface InitOptions<T> {
    component: T;
    predicate: (this: T) => boolean;
    target: (this: T) => ArrayLike<Element>;
    postUpdate?: (this: T) => void;
    disableEventTypes?: string[];
}
export declare class SetupDisabled<T extends BlComponent = BlComponent> {
    #private;
    static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>): SetupDisabled<T>;
    constructor(options: InitOptions<T>);
    withTarget(target: InitOptions<T>['target']): this;
    withPredicate(getDisabled: InitOptions<T>['predicate']): this;
    withPostUpdate(postUpdate: InitOptions<T>['postUpdate']): this;
    withDisableEventTypes(types: string[]): void;
    setup(): this;
    update(): void;
}
