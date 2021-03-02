/**
 * 设置滚动容器 scrollable 的滚动位置，以将 element 显示在顶部的位置
 * @param {HTMLElement} scrollable 可以滚动的容器
 * @param {HTMLElement} to 需要滚动到的位置
 * @param {Object} [options] 选项
 * @param {number} [options.duration] 动画持续时间（秒），0 为无动画
 * @param {()=>void} [options.done] 滚动完成后的回调函数
 * @param {(t: number) => number} [options.smoother] 缓动函数
 */
export function scrollTo(scrollable, to = 0, options = {}) {
  if (!scrollable) return
  const duration = options.duration ?? 0

  const startScrollTop = scrollable.scrollTop
  const offset = to - startScrollTop
  if (offset === 0) return

  if (duration <= 0) {
    scrollable.scrollTop = to
    if (typeof done === 'function') options?.done?.()
    return
  }

  const startTime = Date.now()
  const endTime = startTime + duration * 1000

  let rafId
  const cancel = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = undefined
      if (typeof done === 'function') options?.done?.()
    }
  }

  const refresh = () => {
    const now = Date.now()

    if (now >= endTime) {
      scrollable.scrollTop = to
      if (typeof done === 'function') options?.done?.()
      return
    }

    const percentComplete = (options.smoother || easeInOutSmoother)((now - startTime) / (duration * 1000))

    const currentScrollTop = Math.trunc(percentComplete * offset + startScrollTop)
    scrollable.scrollTop = currentScrollTop
    rafId = requestAnimationFrame(refresh)
  }

  refresh()

  return cancel
}

// 缓动函数
function easeInOutSmoother(t) {
  const ts = t * t
  const tc = ts * t
  return 6 * tc * ts - 15 * ts * ts + 10 * tc
}
