import { compile } from './compile.js';
import { createElement, Fragment } from './jsx.js';
import { dom } from './runtime/index.js';
export function Widget(template) {
    const blNode = template({ createElement, Fragment });
    const { code, make } = compile(blNode);
    class _Widget {
        view;
        model;
        code = code;
        constructor(model, $mountPoint) {
            this.model = model;
            this.view = make({ model });
            dom.append($mountPoint, this.view.create());
        }
        setModel(model) {
            this.view.set((this.model = model));
        }
        update() {
            this.view.update();
        }
        destroy() {
            this.view.destroy();
            this.model.off();
        }
    }
    return function make(model, $mountPoint) {
        return new _Widget(model, $mountPoint);
    };
}
