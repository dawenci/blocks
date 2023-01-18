import { modal } from './make.js';
export function blConfirm(text, options = {}) {
    if (options.cancel == null)
        options.cancel = true;
    const { promise } = modal(text, options);
    return promise;
}
