import { ConnectedCallback, DisconnectedCallback, AdoptedCallback, AttributeChangedCallback, RenderCallback } from './type.js';
import { HookEvent } from './HookEvent.js';
export declare class Hook {
    _hookEv_: HookEvent;
    clear(): void;
    onConnected(callback: ConnectedCallback): void;
    callConnected(ctx: any): void;
    onDisconnected(callback: DisconnectedCallback): void;
    callDisconnected(ctx: any): void;
    onAdopted(callback: AdoptedCallback): void;
    callAdopted(ctx: any): void;
    onAttributeChanged<StrArr extends readonly string[] = readonly string[]>(callback: AttributeChangedCallback<StrArr>): void;
    callAttributeChanged(ctx: any, ...args: any[]): void;
    onAttributeChangedDep<Str extends string>(dep: Str, callback: AttributeChangedCallback<[Str]>): void;
    onAttributeChangedDeps<StrArr extends readonly string[]>(deps: StrArr, callback: AttributeChangedCallback<StrArr>): void;
    onRender(callback: RenderCallback): void;
    callRender(ctx: any): void;
    merge(other: Hook): void;
}
