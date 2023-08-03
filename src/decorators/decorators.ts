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
