type IdType = `${number}`;
declare const EVENTS_FIELD = "_bl_events_";
declare const ID_FIELD = "_bl_event_id_";
declare const LISTENER_FIELD = "_bl_listeners_";
declare const LISTENING_FIELD = "_bl_listening_";
export type BlBindingsMap = Record<string, Array<{
    callback: BlHandler;
    listening: Listening;
}>>;
export type ListenerMap = Record<IdType, Listening>;
export type BlHandler = {
    (...args: any[]): any;
    _callback?: BlHandler;
};
export declare class Listening {
    listener: BlEvent;
    target: BlEvent;
    refCount: number;
    listenerId: IdType;
    listenToId: IdType;
    constructor(listener: BlEvent, target: BlEvent);
    refInc(): void;
    refDec(): void;
    cleanup(): void;
}
export declare class BlEvent {
    [EVENTS_FIELD]?: BlBindingsMap;
    [ID_FIELD]?: IdType;
    [LISTENER_FIELD]?: ListenerMap;
    [LISTENING_FIELD]?: ListenerMap;
    on(type: string, callback: BlHandler): this;
    on(types: string[], callback: BlHandler): this;
    on(keyValue: Record<string, BlHandler>): this;
    once(type: string, callback: BlHandler): this;
    once(types: string[], callback: BlHandler): this;
    once(keyValue: Record<string, BlHandler>): this;
    off(): this;
    off(callback: BlHandler): this;
    off(type: string): this;
    off(type: string, callback: BlHandler): this;
    off(types: string[]): this;
    off(types: string[], callback: BlHandler): this;
    off(keyValue: Record<string, BlHandler>): this;
    trigger(type: string | string[], ...payloads: any[]): this;
    listenTo(other: BlEvent, type: string, callback: BlHandler): this;
    listenTo(other: BlEvent, types: string[], callback: BlHandler): this;
    listenTo(other: BlEvent, keyValue: Record<string, BlHandler>): this;
    listenToOnce(other: BlEvent, type: string, callback: BlHandler): this;
    listenToOnce(other: BlEvent, types: string[], callback: BlHandler): this;
    listenToOnce(other: BlEvent, keyValue: Record<string, BlHandler>): this;
    stopListening(): this;
    stopListening(callback: BlHandler): this;
    stopListening(type: string): this;
    stopListening(types: string[]): this;
    stopListening(other: BlEvent): this;
    stopListening(other: BlEvent, callback: BlHandler): this;
    stopListening(other: BlEvent, events: Record<string, BlHandler>): this;
    stopListening(other: BlEvent, type: string): this;
    stopListening(other: BlEvent, type: string, callback: BlHandler): this;
    stopListening(other: BlEvent, types: string[]): this;
    stopListening(other: BlEvent, types: string[], callback: BlHandler): this;
}
export {};
