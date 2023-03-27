import * as internal from './hook-internal.js';
export declare function onConnected(callback: internal.ConnectedCallback): void;
export declare function onDisconnected(callback: internal.DisconnectedCallback): void;
export declare function onAdopted(callback: internal.AdoptedCallback): void;
export declare function onAttributeChanged<StrArr extends readonly string[] = string[]>(callback: internal.AttributeChangedCallback<StrArr>): void;
export declare function onAttributeChangedDep<Str extends string = string>(callback: internal.AttributeChangedCallback<[Str]>, dep: Str): void;
export declare function onAttributeChangedDeps<StrArr extends readonly string[] = string[]>(callback: internal.AttributeChangedCallback<StrArr>, deps: StrArr): void;
export declare function onRender(callback: internal.RenderCallback): void;
