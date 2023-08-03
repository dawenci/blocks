import type { BlComponent } from '../component/Component';
export type TabIndex = number | `${number}` | null;
export interface InitOptions<T> {
    component: T;
    target: (this: T) => ArrayLike<Node>;
    tabIndex?: TabIndex;
    disabledPredicate?: (this: T) => boolean;
    postUpdate?: (this: T) => void;
}
export declare class SetupTabIndex<T extends BlComponent = BlComponent> {
    #private;
    static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>): SetupTabIndex<T>;
    get tabIndex(): TabIndex;
    set tabIndex(value: TabIndex);
    get disabledTabIndex(): TabIndex;
    set disabledTabIndex(value: TabIndex);
    constructor(options: InitOptions<T>);
    withTabIndex(tabIndex: TabIndex): this;
    withDisabledTabIndex(tabIndex: TabIndex): this;
    withDisabledPredicate(getDisabled: InitOptions<T>['disabledPredicate']): this;
    withPostUpdate(postUpdate: InitOptions<T>['postUpdate']): this;
    withTarget(target: InitOptions<T>['target']): this;
    update(): void;
    setup(): this;
}
