import type { PropOptions } from './decorators.js'
import { addDecoratorData } from './decorators.js'

/**
 * 将 accessor 属性，与 attr 属性关联
 * getter 从 attribute 中取值（根据 type 做类型转换）
 * setter 将设置 attribute
 * defaults 为 getter 拿到 null 时的回退值，如果不设，并且 accessor 有初始化值，则将该初始化值设置为 defaults
 */
export function prop(options: PropOptions = { defaults: null }) {
  const decorator = <This extends Element, Value>(
    accessor: {
      get: () => Value
      set: (value: Value) => void
    },
    ctx: ClassAccessorDecoratorContext<This, Value>
  ) => {
    const attrName = String(ctx.name)
    let getValue: (element: This) => any
    let setValue: (element: Element, value: Value) => void
    if (options.get && options.set) {
      getValue = options.get
      setValue = options.set
    } else {
      getValue = (element: any) => {
        return element[attrName]
      }
      setValue = (element: any, value: Value) => {
        element[attrName] = value
      }
    }

    function getter(this: This): Value {
      const value = getValue(this) as Value
      if (value != null) return value
      if (options.defaults != null) {
        let defaults = options.defaults
        if (typeof options.defaults === 'function') {
          defaults = options.defaults(this)
        }
        return (defaults ?? null) as Value
      } else {
        return null as Value
      }
    }

    function setter(this: This, value: Value): void {
      setValue(this as unknown as This, value)
    }

    function init(initialValue: Value): Value {
      if (options.defaults == null && initialValue != null) {
        options.defaults = initialValue
      }
      return initialValue
    }

    addDecoratorData({
      type: 'prop',
      name: String(ctx.name),
      attrName,
      upgrade: options.upgrade ?? true,
      observed: false,
    })

    return {
      get: getter,
      set: setter,
      init,
    }
  }
  return decorator
}
