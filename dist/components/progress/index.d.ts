import { BlComponent } from '../component/Component.js';
declare const status: string[];
export declare class BlProgress extends BlComponent {
    static get role(): string;
    accessor value: number | null;
    accessor status: MaybeOneOf<typeof status>;
    accessor percentage: boolean;
    accessor $progress: HTMLElement;
    accessor $value: HTMLElement;
    constructor();
    render(): void;
}
export {};
