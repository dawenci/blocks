import { Event } from '../Event/Event.js';
import { HookEventMap } from './type.js';
export declare class HookEvent extends Event<HookEventMap> {
    merge(hook: HookEvent): void;
}
