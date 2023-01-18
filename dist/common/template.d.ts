export declare const makeStyleTemplate: (content: string) => (() => HTMLStyleElement);
export declare const makeTemplate: <T extends HTMLElement>(html: string) => () => T;
export declare const makeFragmentTemplate: (html: string) => (() => DocumentFragment);
export declare const makeDomTemplate: <T extends HTMLElement>(template: T) => () => T;
