import * as BlNode from './node.js';
import { ViewInstance } from './compile.js';
import { JsxFactory } from './jsx.js';
import { BlModel } from './runtime/index.js';
export declare function Widget(template: (jsx: JsxFactory) => BlNode.t): (model: BlModel, $mountPoint: HTMLElement) => {
    view: ViewInstance;
    model: BlModel;
    code: string;
    setModel(model: any): void;
    update(): void;
    destroy(): void;
};
