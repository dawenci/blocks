export function handleCustomElement(target, targetOrOptions) {
    if (targetOrOptions.customElement) {
        if (!customElements.get(targetOrOptions.customElement)) {
            customElements.define(targetOrOptions.customElement, target);
        }
    }
}
