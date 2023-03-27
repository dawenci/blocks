import '../../components/modal/index.js';
import { unmount } from '../../common/mount.js';
export function modal(text, options = {}) {
    const $dialog = document.body.appendChild(document.createElement('bl-modal'));
    $dialog.withConfirm = true;
    $dialog.withCancel = !!options.cancel;
    $dialog.rich = !!options.richMode;
    if (options.resolveValue)
        $dialog.resolveValue = options.resolveValue;
    if (options.rejectValue)
        $dialog.resolveValue = options.rejectValue;
    if (options.confirmText)
        $dialog.confirmText = options.confirmText;
    if (options.cancelText)
        $dialog.cancelText = options.cancelText;
    if (options.onConfirm)
        $dialog.onConfirm = options.onConfirm;
    if (options.onCancel)
        $dialog.onCancel = options.onCancel;
    $dialog.open = true;
    $dialog.content = text;
    const promise = $dialog.promise;
    $dialog.addEventListener('closed', () => {
        unmount($dialog);
    });
    return {
        promise,
        $dialog,
    };
}
