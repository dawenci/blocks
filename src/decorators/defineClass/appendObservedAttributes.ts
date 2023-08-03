export function appendObservedAttributes<T extends CustomElementConstructor>(
  target: T,
  observedAttrs: readonly string[]
) {
  if (observedAttrs.length) {
    let newGetter: any
    if (hasObservedAttributes(target)) {
      const mergedAttrs = [...new Set((target.observedAttributes ?? []).concat(observedAttrs))]
      newGetter = () => mergedAttrs
    } else {
      newGetter = () => observedAttrs
    }
    Object.defineProperty(target, 'observedAttributes', {
      get: () => newGetter(),
      enumerable: true,
      configurable: true,
    })
  }
}

// 检测继承链上各个 class 是否有观察属性
function hasObservedAttributes<T>(target: T): target is T & { get observedAttributes(): readonly string[] } {
  return !!(target as any).observedAttributes
}
