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
export declare abstract class Component extends HTMLElement {
    static get observedAttributes(): readonly string[] | string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    adoptedCallback(): void;
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any): void;
    render(): void;
    prependTo($parent: Node): void;
    appendTo($parent: Node): void;
    mountBefore($sibling: Node): void;
    mountAfter($sibling: Node): void;
    unmount(): void;
    appendShadowChildren(nodes: ArrayLike<Node>): void;
    appendChildren(nodes: ArrayLike<Node>): void;
    upgradeProperty(props?: string[]): void;
    initRole(): void;
    querySelectorHost<T extends Element>(selector: string): T | null;
    querySelectorShadow<T extends Element>(selector: string): T | null;
    querySelectorAllHost<T extends Element>(selector: string): NodeListOf<T>;
    querySelectorAllShadow<T extends Element>(selector: string): NodeListOf<T> | null;
}
export {};
