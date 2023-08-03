import { appendObservedAttributes } from './appendObservedAttributes.js'
import { appendUpgradeProperties } from './appendUpgradeProperties.js'
import { clearDecoratorData, getDecoratorData } from '../decorators.js'

export function handleMembers<T extends CustomElementConstructor>(target: T) {
  // 消费当前 class 定义过程，各个 member 装饰器注册的信息后
  const data = getDecoratorData()
  // 1. attribute 处理
  // 从 @attr 装饰器添加的信息中，提取本轮注册的所有 attr，
  // 过滤出 `observed` 属性不为 `false` 的记录，添加到 `observedAttributes` 中
  appendObservedAttributes(
    target,
    data.filter(record => record.type === 'attr' && record.observed !== false).map(record => record.attrName!)
  )

  // 2. property 处理
  // 从成员装饰器添加的信息中，提取本轮注册的所有装饰器信息记录，
  // 过滤出 `upgrade` 属性不为 `false` 的记录，添加到 `upgradeProperties` 中
  appendUpgradeProperties(
    target,
    data.filter(record => record.upgrade).map(record => record.name!)
  )

  // 消费完所有 member 装饰器注册的信息后，清空记录，以便下一个组件类定义使用
  clearDecoratorData()
}
