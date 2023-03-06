import {
  DecoratorRecord,
  clearDecoratorData,
  getDecoratorData,
} from './decorators.js'

export const defineClass = <T extends CustomElementConstructor>(
  target: T,
  ctx: ClassDecoratorContext<T>
) => {
  ctx.addInitializer(function (this: T) {
    handleMembers(target)
  })
}

export function handleMembers<T extends CustomElementConstructor>(target: T) {
  // 消费当前 class 定义过程，各个 member 装饰器注册的信息后
  const data = getDecoratorData()
  // 1. attribute 处理
  // 从 @attr 装饰器添加的信息中，提取本轮注册的所有 attr，
  // 过滤出 `observed` 属性不为 `false` 的记录，添加到 `observedAttributes` 中
  handleAttrs(target, data)

  // 2. property 处理
  // 从成员装饰器添加的信息中，提取本轮注册的所有装饰器信息记录，
  // 过滤出 `upgrade` 属性不为 `false` 的记录，添加到 `upgradeProperties` 中
  handleUpgrade(target, data)

  // 消费完所有 member 装饰器注册的信息后，清空记录，以便下一个组件类定义使用
  clearDecoratorData()
}

// 检测继承链上各个 class 是否有观察属性
function hasObservedAttributes<T>(
  target: T
): target is T & { get observedAttributes(): string[] } {
  return !!(target as any).observedAttributes
}
function handleAttrs<T extends CustomElementConstructor>(
  target: T,
  data: DecoratorRecord[]
) {
  const observedAttrs = data
    .filter(record => record.type === 'attr' && record.observed !== false)
    .map(record => record.attrName!)

  if (observedAttrs.length) {
    let newGetter: any
    if (hasObservedAttributes(target)) {
      const mergedAttrs = [
        ...new Set((target.observedAttributes ?? []).concat(observedAttrs)),
      ]
      newGetter = () => mergedAttrs
    } else {
      newGetter = () => observedAttrs
    }
    Object.defineProperty(target, 'observedAttributes', {
      get: () => newGetter(),
      enumerable: true,
      configurable: true,
    })
  }
}

// 检测继承链上各个 class 是否有需要升级的属性
function hasUpgradeProperties<T>(
  target: T
): target is T & { get upgradeProperties(): string[] } {
  return (target as any).upgradeProperties
}
function handleUpgrade<T extends CustomElementConstructor>(
  target: T,
  data: DecoratorRecord[]
) {
  const upgradeProps = data
    .filter(record => record.upgrade)
    .map(record => record.name!)
  if (upgradeProps.length) {
    let newGetter: any
    if (hasUpgradeProperties(target)) {
      const mergedProps = [
        ...new Set((target.upgradeProperties ?? []).concat(upgradeProps)),
      ]
      newGetter = () => mergedProps
    } else {
      newGetter = () => upgradeProps
    }
    Object.defineProperty(target, 'upgradeProperties', {
      get: () => newGetter(),
      enumerable: true,
      configurable: true,
    })
  }
}
