/**
 * 应用样式到组件
 * 注意：该装饰器调用多次时，越晚调用的 style 反过来越先插入到 DOM
 */
export function applyStyle<T extends CustomElementConstructor>(
  styleContent: string
) {
  return (target: T, ctx: ClassDecoratorContext<T>) => {
    ctx.addInitializer(function (this: T) {
      const $style: HTMLStyleElement = document.createElement('style')
      $style.textContent = styleContent
      appendComponentStyles(target, $style)
    })
  }
}

// 继承链上是否有 _$componentStyle
function hasStyles<T>(
  target: T
): target is T & { get _$componentStyle(): DocumentFragment } {
  return !!(target as any)._$componentStyle
}
export function appendComponentStyles<T extends CustomElementConstructor>(
  target: T,
  $fragment: DocumentFragment | HTMLStyleElement
) {
  if ($fragment) {
    const $styleFragment = hasStyles(target)
      ? target._$componentStyle.cloneNode(true)
      : document.createDocumentFragment()

    $styleFragment.appendChild($fragment)

    Object.defineProperty(target, '_$componentStyle', {
      get: () => $styleFragment,
      enumerable: true,
      configurable: true,
    })
  }
}
