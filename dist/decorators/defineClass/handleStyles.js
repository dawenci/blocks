import { appendComponentStyles } from './appendComponentStyles.js';
export function handleStyles(target, targetOrOptions) {
    if (targetOrOptions.styles) {
        const $style = document.createElement('style');
        $style.textContent = targetOrOptions.styles.join('\n');
        appendComponentStyles(target, $style);
    }
}
