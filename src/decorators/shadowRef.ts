import { addDecoratorData } from './decorators.js'

/**
 * 将 accessor 属性，与 attr 属性关联
 * getter 从 attribute 中取值（根据 type 做类型转换）
 * setter 将设置 attribute
 * defaults 为 getter 拿到 null 时的回退值，如果不设，并且 accessor 有初始化值，则将该初始化值设置为 defaults
 */
export function shadowRef(selector: string, cache = true) {
  const decorator = <This extends Element, Value>(value: any, ctx: ClassAccessorDecoratorContext<This, Value>) => {
    const cacheKey = cache ? Symbol() : ''
    let getter
    let setter
    if (cache) {
      getter = function (this: This) {
        if ((this as any)[cacheKey] == null) {
          ;(this as any)[cacheKey] = this.shadowRoot?.querySelector?.(selector)
        }
        return (this as any)[cacheKey]
      }
      setter = function (this: This, value: Element | null) {
        ;(this as any)[cacheKey] = value
      }
    } else {
      getter = function (this: This) {
        return this.shadowRoot?.querySelector?.(selector)
      }
      setter = function (this: This, value: Element | null) {
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
