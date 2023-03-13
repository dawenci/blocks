/**
 * @param {Element} el 元素
 * @param {(e: MouseEvent) => void} handler 事件处理器
 */
export function onClickOutside(el: Element | Element[], handler: (e: MouseEvent) => void) {
  if (!Array.isArray(el)) {
    el = [el]
  }

  const callback = (e: MouseEvent) => {
    if (!(el as Element[]).some(el => el.contains(e.target as Element))) {
      handler(e)
    }
  }
  document.addEventListener('mousedown', callback)

  return () => {
    document.removeEventListener('mousedown', callback)
  }
}
