export type Handler<This> = (this: This, ev: KeyboardEvent) => any;
export interface KeyBinding<Ctx> {
    key: string;
    handler: Handler<Ctx>;
    eventType?: 'keydown' | 'keyup' | 'keypress';
    ctx?: Ctx;
    capture?: boolean;
}
export interface KeyBindingGroup {
    eventType: 'keydown' | 'keyup' | 'keypress';
    bindings: KeyBinding<any>[];
    capture: boolean;
}
export declare function onKeymap($el: HTMLElement | Document | Window, bindings: KeyBinding<any>[]): () => void;
