import { Hook } from '../../common/Hook/index.js';
import { Feature } from '../../common/Feature/Feature.js';
export interface BlComponentEventListenerCallback<E extends Event = Event> {
    (evt: E): void;
}
export interface BlComponentEventListenerObject<E extends Event = Event> {
    handleEvent(object: E): void;
}
export type BlComponentEventListener<E extends Event = Event> = BlComponentEventListenerCallback<E> | BlComponentEventListenerObject<E>;
export interface BlComponentEventMap extends HTMLElementEventMap {
    [other: string]: Event;
}
export interface BlComponent extends HTMLElement {
    addEventListener<K extends keyof BlComponentEventMap>(type: K, listener: BlComponentEventListener<BlComponentEventMap[K]>, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BlComponentEventMap>(type: K, listener: BlComponentEventListener<BlComponentEventMap[K]>, options?: boolean | EventListenerOptions): void;
}
export declare class BlComponent extends HTMLElement {
    #private;
    static get role(): string;
    static get observedAttributes(): readonly string[];
    blSilent: boolean;
    get hook(): Hook;
    constructor();
    get cid(): number;
    _features: Map<string | symbol, Feature>;
    addFeature(key: string | symbol, feature: Feature): void;
    getFeature(key: string | symbol): Feature<BlComponent> | undefined;
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
    insertStyle($style: HTMLStyleElement | DocumentFragment | string): HTMLStyleElement | null;
    upgradeProperty(props?: string[]): void;
    initRole(): void;
    querySelectorHost<T extends Element>(selector: string): T | null;
    querySelectorShadow<T extends Element>(selector: string): T | null;
    querySelectorAllHost<T extends Element>(selector: string): NodeListOf<T>;
    querySelectorAllShadow<T extends Element>(selector: string): T[];
    proxyEvent<T extends Element>($el: T, type: Parameters<T['addEventListener']>[0], options?: boolean | AddEventListenerOptions): () => void;
    registerMicrotask(key: any, callback: () => void): void;
    withBlSilent(fn: () => void): void;
    dispatchEvent(event: Event): boolean;
}
