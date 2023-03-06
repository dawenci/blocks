export type StyleChain = {
  $style: HTMLStyleElement
  parent: StyleChain | null
}

export function applyStyle<T extends CustomElementConstructor>(
  styleContent: string
) {
  return (target: T, ctx: ClassDecoratorContext<T>) => {
    ctx.addInitializer(function (this: T) {
      const $style: HTMLStyleElement = document.createElement('style')
      $style.textContent = styleContent

      // 当前 class 对应的 style，parent 存储父类的 styleChain 引用
      const styleChain: StyleChain = {
        $style,
        parent: hasStyles(target) ? target._styleChain : null,
      }

      Object.defineProperty(target, '_styleChain', {
        get: () => styleChain,
        enumerable: true,
        configurable: true,
      })
    })
  }
}

// 继承链上是否有 _styleChain
function hasStyles<T>(
  target: T
): target is T & { get _styleChain(): StyleChain } {
  return !!(target as any)._styleChain
}
