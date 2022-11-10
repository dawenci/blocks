/// <reference path="../types/common/onClickOutside.d.ts" />

/**
 * @param {Element} el 元素
 * @param {(e: MouseEvent) => void} handler 事件处理器
 */
export function onClickOutside(el, handler) {
  if (!Array.isArray(el)) el = [el]

  const callback = (e) => {
    if (!el.some(el => el.contains(e.target))) {
      handler(e)
    }
  }
  document.addEventListener('mousedown', callback)

  return () => {
    document.removeEventListener('mousedown', callback)
  }
}
