export declare const makeStyleTemplate: (content: string) => (() => HTMLStyleElement);
export interface IMakeTemplate {
    <T extends HTMLElement>(html: string): () => T;
    <K extends keyof HTMLElementTagNameMap>(html: string): () => HTMLElementTagNameMap[K];
}
export declare const makeTemplate: IMakeTemplate;
export declare const makeFragmentTemplate: (html: string) => (() => DocumentFragment);
export declare const makeDomTemplate: <T extends HTMLElement>(template: T) => () => T;
