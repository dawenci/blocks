import { modal } from './make.js';
export function blAlert(text, options = {}) {
    options.cancel = false;
    const { promise, $dialog } = modal(text, options);
    const onOpened = () => {
        if ($dialog.$confirm) {
            $dialog.$confirm.focus();
        }
    };
    $dialog.addEventListener('opened', onOpened);
    return promise;
}
