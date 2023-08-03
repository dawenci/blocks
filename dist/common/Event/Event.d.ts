export declare class Event<EventMap> {
    protected _data: any;
    on<EventType extends keyof EventMap>(type: EventType, callback: EventMap[EventType]): void;
    off<EventType extends keyof EventMap>(type: EventType, callback: EventMap[EventType]): void;
    offType<EventType extends keyof EventMap>(type: EventType): void;
    offAll(): void;
    triggerCtx<EventType extends keyof EventMap>(ctx: any, type: EventType): void;
    trigger<EventType extends keyof EventMap>(type: EventType): void;
    triggerWithArgsCtx<EventType extends keyof EventMap, Args extends any[] = []>(ctx: any, type: EventType, ...args: Args): void;
    triggerWithArgs<EventType extends keyof EventMap, Args extends any[] = []>(type: EventType, ...args: Args): void;
    merge(other: Event<EventMap>): void;
}
