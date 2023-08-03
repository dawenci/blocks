// 注册自定义元素
export function handleCustomElement<T extends CustomElementConstructor>(
  target: T,
  targetOrOptions: DefineClassOptions
) {
  if (targetOrOptions.customElement) {
    if (!customElements.get(targetOrOptions.customElement)) {
      customElements.define(targetOrOptions.customElement, target)
    }
  }
}
