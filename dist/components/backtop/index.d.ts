import { BlComponent } from '../component/Component.js';
export declare class BlBackTop extends BlComponent {
    #private;
    static get role(): string;
    accessor duration: number;
    accessor threshold: number;
    visible: import("../../common/reactive.js").IReactive<boolean>;
    constructor();
    get target(): string | Node | null;
    set target(value: string | null | Node | (() => Node));
    get targetElement(): Element | Window;
}
