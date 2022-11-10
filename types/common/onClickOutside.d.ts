/**
 * @param {Element} el 元素
 * @param {(e: MouseEvent) => void} handler 事件处理器
 */
export function onClickOutside(el: Element, handler: (e: MouseEvent) => void): () => void
