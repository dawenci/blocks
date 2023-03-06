export type AttrType =
  | 'string'
  | 'number'
  | 'int'
  | 'enum'
  | 'boolean'
  | 'intRange'

export type AttrOptions = {
  /** 不为 false，则会自动添加到组件类的 observedAttributes 数组中 */
  observed?: boolean

  /** 对于 enum 类型，需要提供 enum 的项 */
  enumValues?: any[] | readonly any[]

  /** 对于 intRange 类型，需要提供 range 的起始、结束点 */
  min?: number
  max?: number

  /** getter 拿到的默认值，如果是函数，则返回调用的结果 */
  defaults?: any | ((componentInstance: any) => any)
}

export type DecoratorRecord = {
  type: 'attr' | 'prop' | 'domRef'
  name: string
  attrType?: string
  attrName?: string
  upgrade?: boolean
  observed?: boolean
}

/**
 * 记录当前组件类定义过程中，所有成员装饰器登记的信息
 * 后续类装饰器可以读取这些信息（类装饰器执行时机比较晚）
 */
const decoratorDataForCurrentClass: DecoratorRecord[] = []

/**
 * 收集成员装饰器的一些信息
 * 以便类装饰器读取使用
 */
export function addDecoratorData(record: DecoratorRecord) {
  decoratorDataForCurrentClass.push(record)
}

export function clearDecoratorData() {
  decoratorDataForCurrentClass.length = 0
}

export function getDecoratorData() {
  return decoratorDataForCurrentClass.slice()
}
