export function cloneElement<T extends Element>($el: T, deep = true): T {
  return $el.cloneNode(deep) as T
}
