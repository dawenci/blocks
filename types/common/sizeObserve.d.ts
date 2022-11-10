/**
 * 检测元素的尺寸变化
 *
 * @export
 * @param {HTMLElement} el 被检测的元素，必须设置了定位属性
 * @param {(size: { width: number, height: number }) => void} handler 回调函数
 * @returns {() => void} 返回一个清理方法
 */
export const sizeObserve: (
  el: Element,
  handler: (data: { width: number; height: number }) => void
) => () => void
