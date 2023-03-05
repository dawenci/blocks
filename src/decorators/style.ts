export function applyStyle<T extends CustomElementConstructor>(
  styleContent: string
) {
  return (target: T, ctx: ClassDecoratorContext<T>) => {
    ctx.addInitializer(function (this: T) {
      const $style: HTMLStyleElement = document.createElement('style')
      $style.textContent = styleContent

      const $styleFragment = hasStyles(target)
        ? target.$style
        : document.createDocumentFragment()
      $styleFragment.appendChild($style)

      Object.defineProperty(target, '_$style', {
        get: () => $styleFragment,
        enumerable: true,
        configurable: true,
      })
    })
  }
}

function hasStyles<T>(
  target: T
): target is T & { get $style(): DocumentFragment } {
  return (target as any).hasOwnProperty('_$style')
}
