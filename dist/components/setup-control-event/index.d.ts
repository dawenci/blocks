import type { BlComponent } from '../component/Component';
export interface InitOptions<T> {
    component: T;
}
export declare class SetupControlEvent<T extends BlComponent = BlComponent> {
    #private;
    static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>): SetupControlEvent<T>;
    constructor(options: InitOptions<T>);
    setup(): this;
}
