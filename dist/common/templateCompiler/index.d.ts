export { setup } from './generate.js';
export { compile } from './compile.js';
export { Widget } from './Widget.js';
export declare const jsx: {
    createElement: (type: string, props: Record<string, any>, ...children: (string | import("./node").BlNode | import("./node").BlFragment)[]) => import("./node").IFragment | import("./node").BlNode;
    Fragment: string;
};
export type { JsxFactory } from './jsx.js';
