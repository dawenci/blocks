import * as BlNode from './node.js';
export declare const Fragment = "jsx.Fragment";
export declare const createElement: (type: string, props: Record<string, any>, ...children: Array<string | BlNode.t | BlNode.BlFragment>) => BlNode.t | BlNode.IFragment;
export type JsxFactory = {
    Fragment: string;
    createElement: typeof createElement;
};
