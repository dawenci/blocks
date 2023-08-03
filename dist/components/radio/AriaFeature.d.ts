import { Feature } from '../../common/Feature/Feature.js';
import { BlComponent } from '../component/Component.js';
export declare class AriaFeature<T extends BlComponent & {
    checked: boolean;
}> extends Feature<T> {
    init(): void;
}
