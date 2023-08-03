export function appendComponentStyles<T extends CustomElementConstructor>(
  target: T,
  $fragment: DocumentFragment | HTMLStyleElement
) {
  if ($fragment) {
    const $styleFragment = hasStyles(target)
      ? target._$componentStyle.cloneNode(true)
      : document.createDocumentFragment()

    $styleFragment.appendChild($fragment.cloneNode(true))

    Object.defineProperty(target, '_$componentStyle', {
      get: () => $styleFragment,
      enumerable: true,
      configurable: true,
    })
  }
}

// 继承链上是否有 _$componentStyle
function hasStyles<T>(target: T): target is T & { get _$componentStyle(): DocumentFragment } {
  return !!(target as any)._$componentStyle
}
