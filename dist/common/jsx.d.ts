export declare const Fragment = "jsx.Fragment";
export declare const createElement: (type: string, props: Record<string, any>, ...children: Array<string | HTMLElement | DocumentFragment>) => HTMLElement | DocumentFragment;
export type JsxFactory = {
    Fragment: string;
    createElement: typeof createElement;
};
