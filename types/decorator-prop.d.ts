type PropOptions = {
  /** 是否需要 upgrade */
  upgrade?: boolean

  // 指定自定义的访问器
  get?: (element: any) => any
  set?: (element: any, value: any) => void

  /** getter 拿到的默认值，如果是函数，则返回调用的结果 */
  defaults?: any | ((componentInstance: any) => any)
}

type BlPropDecorator<This extends Element, Value = any> = (
  accessor: {
    get: () => Value
    set: (value: Value) => void
  },
  ctx: ClassAccessorDecoratorContext<This, Value>
) => {
  get: (this: This) => Value
  set: (this: This, value: Value) => void
  init: (initialValue: Value) => Value
}

interface BlPropDecoratorMaker {
  <This extends Element, Value = any>(options?: PropOptions): BlPropDecorator<This, Value>
}
