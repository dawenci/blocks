export function attachShadow(options: ShadowRootInit): any
export function attachShadow<T extends CustomElementConstructor>(
  target: T,
  ctx: ClassDecoratorContext<T>
): void
export function attachShadow<T extends CustomElementConstructor>(
  target?: T | ShadowRootInit,
  ctx?: ClassDecoratorContext<T>
) {
  if (typeof target === 'function') {
    // @shadow
    const options = { mode: 'open' }
    ctx!.addInitializer(function (this: T) {
      Object.defineProperty(target, '_shadowRootInit', {
        get: () => options,
        enumerable: true,
        configurable: true,
      })
    })
  } else {
    // @shadow(options)
    const options = target as ShadowRootInit
    return function shadow(
      target: T | ShadowRootInit,
      ctx: ClassDecoratorContext<T>
    ) {
      ctx.addInitializer(function (this: T) {
        Object.defineProperty(target, '_shadowRootInit', {
          get: () => options,
          enumerable: true,
          configurable: true,
        })
      })
    }
  }
}
