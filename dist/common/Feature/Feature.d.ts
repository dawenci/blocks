import { BlComponent } from '../../components/component/Component.js';
import { Hook } from '../Hook/index.js';
export declare class Feature<T extends BlComponent = BlComponent> {
    id: string | symbol;
    component: T;
    static make<T extends BlComponent = BlComponent>(id: string | symbol, component: T): Feature<T>;
    hook: Hook;
    constructor(id: string | symbol, component: T);
    init(): void;
}
