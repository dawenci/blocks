/**
 * 执行 enter 过渡，等待过渡完成后，执行回调
 * @export
 * @param {HTMLElement} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function doTransitionEnter(el: HTMLElement, name: string, onEnd: () => void): void {
  transitionEnter(el, name)
  if ((el as any)._clearOnTransitionEnd) {
    ;(el as any)._clearOnTransitionEnd()
  }
  ;(el as any)._clearOnTransitionEnd = onTransitionEnd(el, () => {
    ;(el as any)._clearOnTransitionEnd = null
    clearTransition(el, name)
    if (typeof onEnd === 'function') {
      onEnd()
    }
  })
}

/**
 * 执行 leave 过渡，等待过渡完成后，执行回调
 * @export
 * @param {HTMLElement} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @param {() => void} [onEnd]
 * @returns
 */
export function doTransitionLeave(el: HTMLElement, name: string, onEnd: () => void): void {
  transitionLeave(el, name)
  if ((el as any)._clearOnTransitionEnd) {
    ;(el as any)._clearOnTransitionEnd()
  }
  ;(el as any)._clearOnTransitionEnd = onTransitionEnd(el, () => {
    ;(el as any)._clearOnTransitionEnd = null
    clearTransition(el, name)
    if (typeof onEnd === 'function') {
      onEnd()
    }
  })
}

/**
 * 检查是否过渡
 * @export
 * @param {HTMLElement} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function isTransition(el: HTMLElement, name: string): boolean {
  return isTransitionEnter(el, name) || isTransitionLeave(el, name)
}

/**
 * 执行 enter 过渡
 * @export
 * @param {HTMLElement} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
function transitionEnter(el: HTMLElement, name: string): void {
  el.classList.remove(`${name}-leave-transition-active`)
  el.classList.remove(`${name}-leave-transition-from`)
  el.classList.remove(`${name}-leave-transition-to`)

  el.classList.add(`${name}-enter-transition-active`)
  el.classList.add(`${name}-enter-transition-from`)
  el.offsetHeight
  el.classList.replace(`${name}-enter-transition-from`, `${name}-enter-transition-to`)
}

/**
 * 执行 leave 过渡
 * @export
 * @param {HTMLElement} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
function transitionLeave(el: HTMLElement, name: string): void {
  el.classList.remove(`${name}-enter-transition-active`)
  el.classList.remove(`${name}-enter-transition-from`)
  el.classList.remove(`${name}-enter-transition-to`)

  el.classList.add(`${name}-leave-transition-active`)
  el.classList.add(`${name}-leave-transition-from`)
  el.offsetHeight
  el.classList.replace(`${name}-leave-transition-from`, `${name}-leave-transition-to`)
}

/**
 * 检查是否 enter 过渡
 * @export
 * @param {HTMLElement} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
function isTransitionEnter(el: HTMLElement, name: string): boolean {
  return el.classList.contains(`${name}-enter-transition-active`)
}

/**
 * 检查是否 leave 过渡
 * @export
 * @param {HTMLElement} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
function isTransitionLeave(el: HTMLElement, name: string): boolean {
  return el.classList.contains(`${name}-leave-transition-active`)
}

function clearTransition(el: HTMLElement, name: string): void {
  el.classList.remove(`${name}-enter-transition-active`)
  el.classList.remove(`${name}-enter-transition-from`)
  el.classList.remove(`${name}-enter-transition-to`)
  el.classList.remove(`${name}-leave-transition-active`)
  el.classList.remove(`${name}-leave-transition-from`)
  el.classList.remove(`${name}-leave-transition-to`)
}

/**
 *
 * @export
 * @param {HTMLElement} el 执行过渡动画的元素
 * @param {() => void} callback 动画执行完毕的回调
 */
function onTransitionEnd(el: HTMLElement, callback: () => void): () => void {
  // 从样式中提取动画的执行总时间、需要执行动画的属性数量
  const { transitionTimeout, transitionPropCount } = getTransitionInfo(el)
  const { animationTimeout, animationPropCount } = getAnimationInfo(el)

  // 动画的类型是过渡还是关键帧动画，以持续时间比较久的为准
  const type = transitionTimeout >= animationTimeout ? 'TRANSITION' : 'ANIMATION'
  const timeout = type === 'TRANSITION' ? transitionTimeout : animationTimeout
  const propCount = type === 'TRANSITION' ? transitionPropCount : animationPropCount
  const cancelEvent = type === 'TRANSITION' ? 'transitioncancel' : 'animationcancel'
  const endEvent = type === 'TRANSITION' ? 'transitionend' : 'animationend'

  // 如果没有需要执行过去动画的属性，提前退出
  if (!propCount) {
    callback()
    return noop
  }

  // 已完成过渡动画的属性计数
  let ended = 0

  // 每个属性的动画完成后的逻辑
  const onEnd = (e: Event) => {
    if (e.target === el) {
      // 全部属性的动画都执行完成，结束
      if (++ended >= propCount || e.type === 'transitioncancel') {
        done()
      }
    }
  }

  // 使用定时器兜底，所有属性的过渡动画没在计划的时间内完成，则强制提前完成
  const timeoutHandler = setTimeout(() => {
    if (ended < propCount) {
      done()
    }
  }, timeout + 1)

  // 所有过渡动画完成后的回调，包含清理逻辑
  const done = () => {
    clear()
    callback()
  }

  el.addEventListener(endEvent, onEnd)
  el.addEventListener(cancelEvent, onEnd)

  // 清理逻辑
  const clear = () => {
    clearTimeout(timeoutHandler)
    el.removeEventListener(endEvent, onEnd)
    el.removeEventListener(cancelEvent, onEnd)
  }

  return clear
}

// 获取过渡动画执行全过程的时间
function getTimeout(delays: string[], durations: string[]): number {
  // delays 可能长度短于 durations，重复平铺到长度足够
  while (delays.length < durations.length) {
    delays = delays.concat(delays)
  }
  // 动画时间以 delay + duration 的值最大的为准
  return Math.max(...durations.map((duration, i) => parseFloat(duration) * 1000 + parseFloat(delays[i]) * 1000))
}

// 从样式中提取过渡动画信息
function getTransitionInfo(el: HTMLElement): {
  transitionTimeout: number
  transitionPropCount: number
  hasTransform: boolean
} {
  const styles = window.getComputedStyle(el)
  const transitionDelays = styles.transitionDelay.split(', ')
  const transitionDurations = styles.transitionDuration.split(', ')
  // 执行 transition 的总时间
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations) || 0
  const transitionPropCount = transitionTimeout && transitionDurations.length
  const hasTransform = /\b(transform|all)(,|$)/.test(styles.transitionProperty)
  return {
    transitionTimeout,
    transitionPropCount,
    hasTransform,
  }
}

function getAnimationInfo(el: HTMLElement): {
  animationTimeout: number
  animationPropCount: number
} {
  const styles = window.getComputedStyle(el)
  const animationDelays = styles.animationDelay.split(', ')
  const animationDurations = styles.animationDuration.split(', ')
  // 执行 animation 的总时间
  const animationTimeout = getTimeout(animationDelays, animationDurations) || 0
  const animationPropCount = animationTimeout && animationDurations.length
  return {
    animationTimeout,
    animationPropCount,
  }
}

function noop() {
  //
}
