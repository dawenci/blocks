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
} from '../../common/property.js'

export function makeAccessor<This extends Element, Value = any>(
  attrType: AttrType = 'string',
  attrName: string,
  options: AttrOptions
) {
  let getImpl: (element: This) => any
  if (options.get) {
    getImpl = options.get
  } else {
    switch (attrType) {
      case 'string':
        getImpl = strGetter(attrName)
        break
      case 'boolean':
        getImpl = boolGetter(attrName)
        break
      case 'int':
        getImpl = intGetter(attrName)
        break
      case 'enum':
        getImpl = enumGetter(attrName, options.enumValues ?? [])
        break
      case 'number':
        getImpl = numGetter(attrName)
        break
      case 'intRange':
        getImpl = intRangeGetter(attrName, options.min ?? 0, options.max ?? 0)
        break
    }
  }

  let setImpl: (element: This, value: Value) => void
  if (options.set) {
    setImpl = options.set
  } else {
    switch (attrType) {
      case 'string':
        setImpl = strSetter(attrName)
        break
      case 'boolean':
        setImpl = boolSetter(attrName)
        break
      case 'int':
        setImpl = intSetter(attrName)
        break
      case 'enum':
        setImpl = enumSetter(attrName, options.enumValues ?? [])
        break
      case 'number':
        setImpl = numSetter(attrName)
        break
      case 'intRange':
        setImpl = intRangeSetter(attrName, options.min ?? 0, options.max ?? 0)
        break
    }
  }

  function getter(this: This): Value {
    const value = getImpl.call(this, this) as Value
    if (value != null) return value

    if (options.defaults == null) return null as Value

    let defaults = options.defaults

    if (typeof options.defaults === 'function') {
      defaults = options.defaults(this)
    }

    return (defaults ?? null) as Value
  }

  function setter(this: This, value: Value): void {
    setImpl.call(this, this, value)
  }

  function init(initialValue: Value): Value {
    // accessor 定义时，如果给了初始化赋值，并且没有定义 defaults 值，
    // 则使用该值作为 defaults 值使用
    if (options.defaults == null && initialValue != null) {
      options.defaults = initialValue
    }
    return initialValue
  }

  return {
    get: getter,
    set: setter,
    init,
  }
}
