export function handleShadowDom(target, targetOrOptions) {
    const shadowRootInit = typeof targetOrOptions.attachShadow !== 'object'
        ? { mode: 'open' }
        : targetOrOptions.attachShadow;
    Object.defineProperty(target, '_shadowRootInit', {
        get: () => shadowRootInit,
        enumerable: true,
        configurable: true,
    });
}
