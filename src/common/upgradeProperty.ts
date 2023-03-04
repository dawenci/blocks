// https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
// 属性可能在 prototype 还没有链接到该实例前就设置了（即已经写值到对象上，从而遮蔽掉对象原型上设置的访问器），
// 在用户使用一些框架加载组件时，可能回出现这种情况（组件定义 js 晚于自定义元素加载，customElements.define），
// 因此需要进行属性升级，确保 setter 逻辑能工作（即移除掉遮蔽访问器的属性值，重新设置以触发 setter）。

export function upgradeProperty(element: HTMLElement, prop: string) {
  if (element.hasOwnProperty(prop)) {
    const value = (element as any)[prop]
    delete (element as any)[prop]
    ;(element as any)[prop] = value
  }
}
