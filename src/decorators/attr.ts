import {
  boolGetter,
  boolSetter,
  strGetter,
  strSetter,
  intGetter,
  intSetter,
  enumGetter,
  enumSetter,
  numGetter,
  numSetter,
  intRangeGetter,
  intRangeSetter,
} from '../common/property.js'
import { kebabCase } from '../common/utils.js'
import { addDecoratorData } from './decorators.js'
import type { AttrType, AttrOptions } from './decorators.js'

/**
 * 将 accessor 属性，与 attr 属性关联
 * getter 从 attribute 中取值（根据 type 做类型转换）
 * setter 将设置 attribute
 * defaults 为 getter 拿到 null 时的回退值，如果不设，并且 accessor 有初始化值，则将该初始化值设置为 defaults
 */
export function attr(
  attrType: AttrType = 'string',
  options: AttrOptions = { defaults: null }
) {
  const decorator = <This extends Element, Value>(
    accessor: {
      get: () => Value
      set: (value: Value) => void
    },
    ctx: ClassAccessorDecoratorContext<This, Value>
  ) => {
    const attrName = kebabCase(String(ctx.name))
    let getValue: (element: This) => any
    switch (attrType) {
      case 'string':
        getValue = strGetter(attrName)
        break
      case 'boolean':
        getValue = boolGetter(attrName)
        break
      case 'int':
        getValue = intGetter(attrName)
        break
      case 'enum':
        getValue = enumGetter(attrName, options.enumValues!)
        break
      case 'number':
        getValue = numGetter(attrName)
        break
      case 'intRange':
        getValue = intRangeGetter(attrName, options.min!, options.max!)
        break
    }

    let setValue: (element: Element, value: Value) => void
    switch (attrType) {
      case 'string':
        setValue = strSetter(attrName)
        break
      case 'boolean':
        setValue = boolSetter(attrName)
        break
      case 'int':
        setValue = intSetter(attrName)
        break
      case 'enum':
        setValue = enumSetter(attrName, options.enumValues!)
        break
      case 'number':
        setValue = numSetter(attrName)
        break
      case 'intRange':
        setValue = intRangeSetter(attrName, options.min!, options.max!)
        break
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
      type: 'attr',
      name: String(ctx.name),
      attrType,
      attrName,
      upgrade: true,
      observed: options.observed,
    })

    return {
      get: getter,
      set: setter,
      init,
    }
  }
  return decorator
}

// 常用 attr
export type EnumAttr<A extends readonly any[]> = A[number]
export type NullableEnumAttr<A extends readonly any[]> = A[number] | null
export type EnumAttrs = {
  size: EnumAttr<['small', 'large']>
}
export const attrs = {
  size: attr('enum', { enumValues: ['small', 'large'] }),
}
