export function makeAccessor<This extends Element, Value = any>(propName: string, options: PropOptions) {
  const getImpl: (element: This) => any =
    options.get ??
    ((element: any) => {
      return element[propName]
    })

  const setImpl: (element: This, value: Value) => void =
    options.set ??
    ((element: This, value: Value) => {
      ;(element as any)[propName] = value
    })

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
