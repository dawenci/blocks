export type ConnectedCallback = () => void;
export type DisconnectedCallback = () => void;
export type AdoptedCallback = () => void;
export type AttributeChangedCallback<StrArr extends readonly string[]> = (name: OneOf<StrArr>, oldValue: string | null, newValue: string | null) => void;
export type RenderCallback = () => void;
export declare function setCurrentHook(hook: Hook): void;
export declare function getCurrentHook(): Hook | null;
export declare const enum HookType {
    Connected = 0,
    Disconnected = 1,
    Adopted = 2,
    AttributeChanged = 3,
    Render = 4
}
export declare class Hook {
    hooks: any;
    on(type: HookType, callback: (...args: any[]) => void): void;
    call(ctx: any, type: HookType, ...args: any[]): void;
    clear(): void;
}
export declare function clearHooks(hook: Hook): void;
export declare function onConnected(hook: Hook, callback: ConnectedCallback): void;
export declare function onDisconnected(hook: Hook, callback: DisconnectedCallback): void;
export declare function onAdopted(hook: Hook, callback: AdoptedCallback): void;
export declare function onAttributeChanged<StrArr extends readonly string[] = string[]>(hook: Hook, callback: AttributeChangedCallback<StrArr>): void;
export declare function onAttributeChangedDep<Str extends string>(hook: Hook, callback: AttributeChangedCallback<[Str]>, dep: Str): void;
export declare function onAttributeChangedDeps<StrArr extends readonly string[]>(hook: Hook, callback: AttributeChangedCallback<StrArr>, deps: StrArr): void;
export declare function onRender(hook: Hook, callback: RenderCallback): void;
