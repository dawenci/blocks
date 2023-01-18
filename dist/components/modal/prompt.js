import { modal } from './make.js';
export function blPrompt(text, options = {}) {
    const $input = document.createElement('bl-input');
    options.resolveValue = () => $input.value;
    const { $dialog, promise } = modal(text, options);
    $dialog.appendChild($input);
    $dialog.addEventListener('focus', () => {
        requestAnimationFrame(() => {
            $input.focus();
        });
    });
    $input.onkeydown = e => {
        if (e.key === 'Enter') {
            $dialog.confirm();
        }
    };
    return promise;
}
