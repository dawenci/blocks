import { Component } from '../component/Component.js';
export declare class BlocksBackTop extends Component {
    #private;
    accessor duration: number;
    accessor threshold: number;
    visible: import("../../common/reactive.js").IReactive<boolean>;
    constructor();
    get target(): string | Node | null;
    set target(value: string | null | Node | (() => Node));
    get targetElement(): Element | Window;
}
