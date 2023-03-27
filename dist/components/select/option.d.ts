import { Component } from '../component/Component.js';
export declare class BlocksOption extends Component {
    #private;
    accessor value: string | null;
    accessor label: string | null;
    accessor disabled: boolean;
    accessor selected: boolean;
    constructor();
    silentSelected(value: boolean): void;
}
