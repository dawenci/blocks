import type { ComponentEventMap } from '../component/Component.js';
import { Component } from '../component/Component.js';
export interface WithOpenTransitionEventMap extends ComponentEventMap {
    opened: CustomEvent;
    closed: CustomEvent;
    'open-changed': CustomEvent<{
        value: boolean;
    }>;
}
export declare class WithOpenTransition extends Component {
    accessor open: boolean;
    accessor openTransitionName: string;
    setupMixin(): void;
}
