import { appendComponentStyles } from './appendComponentStyles.js'

export function handleStyles<T extends CustomElementConstructor>(target: T, targetOrOptions: DefineClassOptions) {
  if (targetOrOptions.styles) {
    const $style: HTMLStyleElement = document.createElement('style')
    $style.textContent = targetOrOptions.styles.join('\n')
    appendComponentStyles(target, $style)
  }
}
