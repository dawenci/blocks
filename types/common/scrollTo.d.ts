/**
 * 设置滚动容器 scrollable 的滚动位置，以将 element 显示在顶部的位置
 * @param {HTMLElement} scrollable 可以滚动的容器
 * @param {HTMLElement} to 需要滚动到的位置
 * @param {Object} [options] 选项
 * @param {number} [options.duration] 动画持续时间（秒），0 为无动画
 * @param {()=>void} [options.done] 滚动完成后的回调函数
 * @param {(t: number) => number} [options.smoother] 缓动函数
 */
export function scrollTo(scrollable: Element, to?: number, options?: {
  duration?: number;
  done?: () => void;
  smoother?: (t: number) => number;
}): () => void
