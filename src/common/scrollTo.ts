type ScrollToOptions = {
  /**
   * 动画持续时间（秒），0 为无动画
   */
  duration?: number
  /**
   * 滚动完成后的回调函数
   */
  done?: () => void
  /**
   * 缓动函数
   */
  smoother?: (t: number) => number
  /**
   * 滚动的属性
   */
  property?: string
}

/**
 * 设置滚动容器 scrollable 的滚动位置，以将 element 显示在顶部的位置
 * @param {HTMLElement} scrollable 可以滚动的容器
 * @param {HTMLElement} to 需要滚动到的位置
 * @param {ScrollToOptions} [options] 选项
 */
export function scrollTo(
  scrollable: HTMLElement,
  to = 0,
  options: ScrollToOptions = {}
) {
  if (!scrollable) return
  const duration = options.duration || 0

  const property = (options.property as keyof HTMLElement) ?? 'scrollTop'
  const startPosition = scrollable[property] as number
  const offset = to - startPosition
  if (offset === 0) return

  if (duration <= 0) {
    ;(scrollable[property] as number) = to
    if (typeof options.done === 'function') {
      options.done()
    }
    return
  }

  const startTime = Date.now()
  const endTime = startTime + duration * 1000

  let rafId: number | undefined
  const cancel = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = undefined
      if (typeof options.done === 'function') options?.done?.()
    }
  }

  const refresh = () => {
    const now = Date.now()

    if (now >= endTime) {
      ;(scrollable[property] as number) = to
      if (typeof options.done === 'function') {
        options.done()
      }
      return
    }

    const percentComplete = (options.smoother || easeInOutSmoother)(
      (now - startTime) / (duration * 1000)
    )

    const currentPosition = Math.trunc(percentComplete * offset + startPosition)
    ;(scrollable[property] as number) = currentPosition
    rafId = requestAnimationFrame(refresh)
  }

  refresh()

  return cancel
}

// 缓动函数
function easeInOutSmoother(t: number): number {
  const ts = t * t
  const tc = ts * t
  return 6 * tc * ts - 15 * ts * ts + 10 * tc
}
