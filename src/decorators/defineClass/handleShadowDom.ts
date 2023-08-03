export function handleShadowDom<T extends CustomElementConstructor>(target: T, targetOrOptions: DefineClassOptions) {
  const shadowRootInit: ShadowRootInit =
    typeof targetOrOptions.attachShadow !== 'object'
      ? { mode: 'open' }
      : (targetOrOptions.attachShadow as ShadowRootInit)
  Object.defineProperty(target, '_shadowRootInit', {
    get: () => shadowRootInit,
    enumerable: true,
    configurable: true,
  })
}
