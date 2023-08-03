import type { BlComponentEventMap } from '../component/Component.js';
import { BlComponent } from '../component/Component.js';
export interface WithOpenTransitionEventMap extends BlComponentEventMap {
    opened: CustomEvent;
    closed: CustomEvent;
    'open-changed': CustomEvent<{
        value: boolean;
    }>;
}
export declare class WithOpenTransition extends BlComponent {
    accessor open: boolean;
    accessor openTransitionName: string;
    setupMixin(): void;
}
