import { BlComponent } from '../component/Component.js';
export declare class BlOption extends BlComponent {
    #private;
    static get role(): string;
    accessor value: string | null;
    accessor label: string | null;
    accessor disabled: boolean;
    accessor selected: boolean;
    constructor();
    silentSelected(value: boolean): void;
}
