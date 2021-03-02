// https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
// 属性可能在 prototype 还没有链接到该实例前就设置了，
// 在用户使用一些框架加载组件时，可能回出现这种情况，
// 因此需要进行属性升级，确保 setter 逻辑能工作，

export function upgradeProperty(element, prop) {
  if (element.hasOwnProperty(prop)) {
    const value = element[prop]
    delete element[prop]
    element[prop] = value
  }
}
