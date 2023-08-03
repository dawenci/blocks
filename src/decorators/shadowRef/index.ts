import { addDecoratorData } from '../decorators.js'

/**
 * 将 accessor 属性，与 attr 属性关联
 * getter 从 attribute 中取值（根据 type 做类型转换）
 * setter 将设置 attribute
 * defaults 为 getter 拿到 null 时的回退值，如果不设，并且 accessor 有初始化值，则将该初始化值设置为 defaults
 */
export const shadowRef: BlBlShadowRefDecoratorMaker = <This extends Element, Value>(selector: string, cache = true) => {
  const decorator: BlShadowRefDecorator<This, Value> = (_, ctx) => {
    let getter
    let setter

    // 启用缓存，适用于 dom 一开始就初始化，并伴随组件全生命周期都存在的情况，提高性能
    // 允许人工覆盖
    if (cache) {
      const cacheKey = Symbol()
      getter = function (this: This) {
        if ((this as any)[cacheKey] == null) {
          ;(this as any)[cacheKey] = this.shadowRoot?.querySelector?.(selector) ?? null
        }
        return (this as any)[cacheKey]
      }
      setter = function (this: This, value: Element | null) {
        ;(this as any)[cacheKey] = value
      }
    }

    // 不使用缓存，适用于 DOM 条件生成的情况，每次访问都重新执行查询，忽略用户赋值
    else {
      getter = function (this: This) {
        return this.shadowRoot?.querySelector?.(selector) ?? null
      }
      setter = function () {
        //
      }
    }

    function init(initialValue: Value): Value {
      return initialValue
    }

    addDecoratorData({
      type: 'shadowRef',
      name: String(ctx.name),
    })

    return {
      init,
      get: getter,
      set: setter,
    }
  }
  return decorator
}
