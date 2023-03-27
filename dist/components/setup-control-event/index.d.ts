import type { Component } from '../component/Component';
export interface InitOptions<T> {
    component: T;
}
export declare class SetupControlEvent<T extends Component = Component> {
    #private;
    static setup<T extends Component = Component>(options: InitOptions<T>): SetupControlEvent<T>;
    constructor(options: InitOptions<T>);
    setup(): this;
}
