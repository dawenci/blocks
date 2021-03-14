/**
 * 执行 enter 过渡
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function transitionEnter(el, name) {
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
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function transitionLeave(el, name) {
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
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function isTransitionEnter(el, name) {
  return el.classList.contains(`${name}-enter-transition-active`)
}

/**
 * 检查是否 leave 过渡
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function isTransitionLeave(el, name) {
  return el.classList.contains(`${name}-leave-transition-active`)
}

/**
 * 检查是否过渡
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function isTransition(el, name) {
  return isTransitionEnter(el, name) || isTransitionLeave(el, name)
}

export function clearTransition(el, name) {
  el.classList.remove(`${name}-enter-transition-active`)
  el.classList.remove(`${name}-enter-transition-from`)
  el.classList.remove(`${name}-enter-transition-to`)
  el.classList.remove(`${name}-leave-transition-active`)
  el.classList.remove(`${name}-leave-transition-from`)
  el.classList.remove(`${name}-leave-transition-to`)
}
