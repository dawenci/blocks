/**
 * 执行 enter 过渡
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function transitionEnter(el: Element, name: string): void

/**
 * 执行 leave 过渡
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function transitionLeave(el: Element, name: string): void

/**
 * 执行 enter 过渡，等待过渡完成后，执行回调
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function doTransitionEnter(el: Element, name: string, onEnd: () => void): void

/**
 * 执行 leave 过渡，等待过渡完成后，执行回调
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @param {() => void} [onEnd]
 * @returns
 */
export function doTransitionLeave(el: Element, name: string, onEnd: () => void): void

/**
 * 检查是否 enter 过渡
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function isTransitionEnter(el: Element, name: string): boolean

/**
 * 检查是否 leave 过渡
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function isTransitionLeave(el: Element, name: string): boolean

/**
 * 检查是否过渡
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {string} name 过渡的名称
 * @returns
 */
export function isTransition(el: Element, name: string): boolean

export function clearTransition(el: Element, name: string): void

/**
 *
 * @export
 * @param {Element} el 执行过渡动画的元素
 * @param {() => void} callback 动画执行完毕的回调
 */
export function onTransitionEnd(el: Element, callback: () => void): () => void

// 获取过渡动画执行全过程的时间
function getTimeout(delays: string[], durations: string[]): number

// 从样式中提取过渡动画信息
function getTransitionInfo(el: Element): {
  transitionTimeout: number;
  transitionPropCount: number;
  hasTransform: boolean;
}


function getAnimationInfo(el: Element): {
  animationTimeout: number;
  animationPropCount: number;
}
