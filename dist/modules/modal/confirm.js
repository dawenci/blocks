import { modal } from './make.js';
export function blConfirm(text, options = {}) {
    if (options.cancel == null)
        options.cancel = true;
    const { promise, $dialog } = modal(text, options);
    const onOpened = () => {
        if ($dialog.$cancel) {
            $dialog.$cancel.focus();
        }
    };
    $dialog.addEventListener('opened', onOpened);
    return promise;
}
