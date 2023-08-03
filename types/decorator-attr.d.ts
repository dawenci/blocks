type BlAttrDecorator<This extends Element, Value = any> = (
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

interface BlAttrDecoratorMaker {
  <This extends Element, Value = any>(attrType: AttrType, options?: AttrOptions): BlAttrDecorator<This, Value>
}

type AttrType = 'string' | 'number' | 'int' | 'enum' | 'boolean' | 'intRange'

type AttrOptions = {
  /** 不为 false，则会自动添加到组件类的 observedAttributes 数组中 */
  observed?: boolean
  /** 是否需要 upgrade */
  upgrade?: boolean

  /** 对于 enum 类型，需要提供 enum 的项 */
  enumValues?: any[] | readonly any[]

  /** 对于 intRange 类型，需要提供 range 的起始、结束点 */
  min?: number
  max?: number

  // 指定自定义的访问器
  get?: (element: any) => any
  set?: (element: any, value: any) => void

  /** getter 拿到的默认值，如果是函数，则返回调用的结果 */
  defaults?: any | ((componentInstance: any) => any)
}

interface BlAttrDecoratorMaker {
  bool: BlAttrDecorator<Element, boolean>
  int: BlAttrDecorator<Element, number>
  num: BlAttrDecorator<Element, number>
  str: BlAttrDecorator<Element, string>
  enum: <T extends readonly any[]>(enumValues: T) => BlAttrDecorator<Element, T>
  intRange: (min: number, max: number) => BlAttrDecorator<Element, number>
}
