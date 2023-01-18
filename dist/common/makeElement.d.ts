interface MakeElementOptions<K extends keyof HTMLElementTagNameMap> {
    tagName: K;
    props?: Record<string, any>;
    attrs?: Record<string, string>;
    styles?: Record<string, string>;
    children?: Array<string | MakeElementOptions<keyof HTMLElementTagNameMap>>;
}
export declare function makeElement(text: string): Text;
export declare function makeElement<K extends keyof HTMLElementTagNameMap>(options: MakeElementOptions<K>): HTMLElementTagNameMap[K];
export {};
