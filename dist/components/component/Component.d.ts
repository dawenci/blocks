import * as hook from './hook-internal.js';
interface ComponentEventListenerCallback<E extends Event = Event> {
    (evt: E): void;
}
interface ComponentEventListenerObject<E extends Event = Event> {
    handleEvent(object: E): void;
}
export type ComponentEventListener<E extends Event = Event> = ComponentEventListenerCallback<E> | ComponentEventListenerObject<E>;
export interface ComponentEventMap extends HTMLElementEventMap {
    [other: string]: Event;
}
export interface Component extends HTMLElement {
    addEventListener<K extends keyof ComponentEventMap>(type: K, listener: ComponentEventListener<ComponentEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ComponentEventMap>(type: K, listener: ComponentEventListener<ComponentEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class Component extends HTMLElement {
    #private;
    static get observedAttributes(): readonly string[];
    constructor();
    get cid(): number;
    onConnected(callback: hook.ConnectedCallback): void;
    onDisconnected(callback: hook.DisconnectedCallback): void;
    onAdopted(callback: hook.AdoptedCallback): void;
    onAttributeChanged<StrArr extends readonly string[] = string[]>(callback: hook.AttributeChangedCallback<StrArr>): void;
    onAttributeChangedDep<Str extends string>(dep: Str, callback: hook.AttributeChangedCallback<[Str]>): void;
    onAttributeChangedDeps<StrArr extends readonly string[] = string[]>(deps: StrArr, callback: hook.AttributeChangedCallback<StrArr>): void;
    onRender(callback: hook.RenderCallback): void;
    clearHooks(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    adoptedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    render(): void;
    prependTo($parent: Node): void;
    appendTo($parent: Node): void;
    mountBefore($sibling: Node): void;
    mountAfter($sibling: Node): void;
    unmount(): void;
    appendShadowChild(node: Node): void;
    appendShadowChildren(nodes: ArrayLike<Node>): void;
    appendChildren(nodes: ArrayLike<Node>): void;
    insertStyle($style: HTMLStyleElement | DocumentFragment | string): void;
    upgradeProperty(props?: string[]): void;
    initRole(): void;
    querySelectorHost<T extends Element>(selector: string): T | null;
    querySelectorShadow<T extends Element>(selector: string): T | null;
    querySelectorAllHost<T extends Element>(selector: string): NodeListOf<T>;
    querySelectorAllShadow<T extends Element>(selector: string): T[];
}
export {};
