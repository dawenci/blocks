import * as runtime from './runtime/index.js';
import * as BlNode from './node.js';
export type ViewInstance = {
    create: () => DocumentFragment;
    update: () => DocumentFragment;
    destroy: () => void;
    set: (model: runtime.BlModel | Record<string, any>) => void;
};
export type ViewMaker = (options: {
    model: any;
}) => ViewInstance;
export declare function compile(root: BlNode.t): {
    make: ViewMaker;
    code: string;
};
