import { modal } from './make.js';
export function blAlert(text, options = {}) {
    options.cancel = false;
    const { promise } = modal(text, options);
    return promise;
}
