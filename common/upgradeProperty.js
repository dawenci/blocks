// https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
// 属性可能在 prototype 还没有链接到该实例前就设置了，
// 在用户使用一些框架加载组件时，可能回出现这种情况（组件定义 js 晚于自定义元素加载，customElements.define），
// 因此需要进行属性升级，确保 setter 逻辑能工作，

/**
 * @param {HTMLElement} element
 * @param {string} prop
 */
export function upgradeProperty(element, prop) {
  if (element.hasOwnProperty(prop)) {
    const value = element[prop]
    delete element[prop]
    element[prop] = value
  }
}
